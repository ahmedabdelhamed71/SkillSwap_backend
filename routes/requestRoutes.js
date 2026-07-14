const express = require('express');
const {
  createRequest,
  getIncomingRequests,
  getOutgoingRequests,
  getRequestById,
  acceptRequest,
  rejectRequest,
} = require('../controllers/requestController');

const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createRequest);
router.get('/incoming', getIncomingRequests);
router.get('/outgoing', getOutgoingRequests);
router.get('/:id', getRequestById);
router.patch('/:id/accept', acceptRequest);
router.patch('/:id/reject', rejectRequest);

module.exports = router;
