import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "Omni-Code AI Online",
    features: ["PWA", "Alarm", "Support Slider"],
  });
});

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

router.post("/set-alarm", (_req, res) => {
  res.status(200).send({ success: true, alarmSet: true });
});

export default router;
