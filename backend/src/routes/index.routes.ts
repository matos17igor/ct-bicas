import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { AuhtController } from "../controllers/AuthController.js";
import { CourtController } from "../controllers/CourtController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { BookingController } from "../controllers/BookingController.js";
import { ProfileController } from "../controllers/ProfileController.js";
import { BlockedSlotController } from "../controllers/BlockedSlotController.js";

const router = Router();
const userController = new UserController();
const auhtController = new AuhtController();
const courtController = new CourtController();
const bookingController = new BookingController();
const profileController = new ProfileController();
const blockedSlotController = new BlockedSlotController();

router.post("/users", userController.create);
router.post("/login", auhtController.login);
router.get("/me", authMiddleware, profileController.getMe);
router.patch("/me", authMiddleware, profileController.updateMe);
router.patch("/me/password", authMiddleware, profileController.updatePassword);

router.post("/courts", authMiddleware, adminMiddleware, courtController.create);
router.get("/courts", courtController.index);

router.post("/bookings", authMiddleware, bookingController.create);
router.get("/me/bookings", authMiddleware, bookingController.indexByUser);
router.delete("/bookings/:id", authMiddleware, bookingController.delete);
router.get(
  "/admin/bookings",
  authMiddleware,
  adminMiddleware,
  bookingController.indexAll
);

router.post("/admin/blocked-slots", authMiddleware, adminMiddleware, blockedSlotController.create);
router.get("/admin/blocked-slots", authMiddleware, adminMiddleware, blockedSlotController.index);
router.delete("/admin/blocked-slots/:id", authMiddleware, adminMiddleware, blockedSlotController.delete);

router.get("/courts/:courtId/bookings", bookingController.listByCourtAndDate);

export { router };
