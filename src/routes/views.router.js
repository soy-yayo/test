import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {}); // Renderiza la vista index
});

export default router;