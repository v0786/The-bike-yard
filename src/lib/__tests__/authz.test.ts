import { describe, it, expect, vi, beforeEach } from "vitest"

// --- Role-based authorization tests (TESTING.md §5) ---
// Tests the requireAuth / requireRole logic by mocking NextAuth's auth()

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}))

import { auth } from "@/lib/auth"
import { requireAuth, requireRole, AuthError } from "@/lib/api-auth"

const mockAuth = auth as ReturnType<typeof vi.fn>

const mockSession = (user: any) => ({ user })

describe("Authorization (RBAC) per API.md §9", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe("requireAuth", () => {
    it("returns user when authenticated", async () => {
      mockAuth.mockResolvedValue(mockSession({ id: "1", email: "a@b.com", role: "Manager" }))
      const user = await requireAuth()
      expect(user.id).toBe("1")
      expect(user.role).toBe("Manager")
    })

    it("throws 401 when unauthenticated", async () => {
      mockAuth.mockResolvedValue(null)
      await expect(requireAuth()).rejects.toMatchObject({
        code: "UNAUTHENTICATED",
        status: 401,
      })
    })
  })

  describe("requireRole", () => {
    const adminRoles = ["Super Admin", "Owner", "Manager"]
    const salesRoles = ["Sales Exec", "Manager", "Super Admin", "Owner"]
    const accountantRoles = ["Accountant", "Manager", "Super Admin", "Owner"]

    it("allows Super Admin for admin routes", async () => {
      mockAuth.mockResolvedValue(mockSession({ id: "1", role: "Super Admin" }))
      const user = await requireRole(adminRoles)
      expect(user.role).toBe("Super Admin")
    })

    it("allows Owner for admin routes", async () => {
      mockAuth.mockResolvedValue(mockSession({ id: "1", role: "Owner" }))
      const user = await requireRole(adminRoles)
      expect(user.role).toBe("Owner")
    })

    it("blocks Accountant from stock inward (403)", async () => {
      mockAuth.mockResolvedValue(mockSession({ id: "1", role: "Accountant" }))
      await expect(requireRole(["Manager", "Super Admin", "Owner"])).rejects.toMatchObject({
        code: "FORBIDDEN",
        status: 403,
      })
    })

    it("blocks Sales Exec from settings (403)", async () => {
      mockAuth.mockResolvedValue(mockSession({ id: "1", role: "Sales Exec" }))
      await expect(requireRole(["Super Admin", "Owner"])).rejects.toMatchObject({
        code: "FORBIDDEN",
        status: 403,
      })
    })

    it("allows Sales Exec for bookings (403 matrix: Sales Exec ✓)", async () => {
      mockAuth.mockResolvedValue(mockSession({ id: "1", role: "Sales Exec" }))
      const user = await requireRole(["Sales Exec", "Manager", "Super Admin", "Owner"])
      expect(user.role).toBe("Sales Exec")
    })

    it("allows Insurance Staff for insurance write", async () => {
      mockAuth.mockResolvedValue(mockSession({ id: "1", role: "Insurance Staff" }))
      const user = await requireRole(["Insurance Staff", "Super Admin", "Owner"])
      expect(user.role).toBe("Insurance Staff")
    })

    it("blocks Insurance Staff from RTO write (403)", async () => {
      mockAuth.mockResolvedValue(mockSession({ id: "1", role: "Insurance Staff" }))
      await expect(requireRole(["RTO Staff", "Super Admin", "Owner"])).rejects.toMatchObject({
        code: "FORBIDDEN",
        status: 403,
      })
    })

    it("blocks RTO Staff from insurance write (403)", async () => {
      mockAuth.mockResolvedValue(mockSession({ id: "1", role: "RTO Staff" }))
      await expect(requireRole(["Insurance Staff", "Super Admin", "Owner"])).rejects.toMatchObject({
        code: "FORBIDDEN",
        status: 403,
      })
    })

    it("refund self-approval blocked: requester role not in approver list", async () => {
      // Refund approval: Manager, Super Admin, Owner (requester cannot self-approve per AUTH_SECURITY §4.3)
      mockAuth.mockResolvedValue(mockSession({ id: "1", role: "Accountant" }))
      await expect(requireRole(["Manager", "Super Admin", "Owner"])).rejects.toMatchObject({
        code: "FORBIDDEN",
        status: 403,
      })
    })

    it("Super Admin accesses endpoints where Super Admin is in the allowed list", async () => {
      mockAuth.mockResolvedValue(mockSession({ id: "1", role: "Super Admin" }))
      // Super Admin should pass whenever included in allowed roles
      for (const roles of [
        ["Super Admin", "Owner", "Manager"],
        ["Super Admin", "Sales Exec"],
        ["Super Admin", "Accountant"],
        ["Super Admin", "Insurance Staff"],
        ["Super Admin", "RTO Staff"],
        ["Super Admin"],
      ]) {
        const user = await requireRole(roles)
        expect(user.role).toBe("Super Admin")
      }
    })

    it("Super Admin is blocked when NOT in allowed list", async () => {
      mockAuth.mockResolvedValue(mockSession({ id: "1", role: "Super Admin" }))
      // A route restricted ONLY to Sales Exec should NOT admit Super Admin
      // (per strict matrix reading; adjust if business policy grants SA bypass)
      await expect(requireRole(["Sales Exec"])).rejects.toMatchObject({
        code: "FORBIDDEN",
        status: 403,
      })
    })
  })
})

describe("AuthError response helper", () => {
  it("returns correct status and code for 401", () => {
    const err = new AuthError("UNAUTHENTICATED", "No session", 401)
    expect(err.code).toBe("UNAUTHENTICATED")
    expect(err.status).toBe(401)
    expect(err.message).toBe("No session")
  })
  it("returns correct status and code for 403", () => {
    const err = new AuthError("FORBIDDEN", "Insufficient permissions", 403)
    expect(err.code).toBe("FORBIDDEN")
    expect(err.status).toBe(403)
  })
})
