import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { AuhtController } from "../controllers/AuthController.js";
import { CourtController } from "../controllers/CourtController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { BookingController } from "../controllers/BookingController.js";

const router = Router();
const userController = new UserController();
const auhtController = new AuhtController();
const courtController = new CourtController();
const bookingController = new BookingController();

router.post("/users", userController.create);
router.post("/login", auhtController.login);
router.get("/me", authMiddleware, async (req: any, res) => {
  return res.json({
    message: `Voce esta autenticado! Seu id e: ${req.userId}`,
  });
});

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

router.get("/courts/:courtId/bookings", bookingController.listByCourtAndDate);

export { router };
