const AuctionItem = require('../models/AuctionItem');

const updateAuctionStatuses = async () => {
  const now = new Date();

  const items = await AuctionItem.find({
    status: { $in: ['upcoming', 'live'] }
  });

  for (const item of items) {
    if (item.status === 'upcoming' && now >= item.startTime) {
      item.status = 'live';
    } else if (item.status === 'live' && now >= item.endTime) {
      item.status = 'ended';

      if (item.currentBid?.bidder) {
        item.winner = item.currentBid.bidder;
        // You can notify winner here
      }
    }
    await item.save();
  }
};

module.exports = updateAuctionStatuses;
