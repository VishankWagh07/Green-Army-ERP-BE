import { col, fn, Op } from "sequelize";
import { sequelize } from "../../config/db.js";
import { Donation, Donor } from "../../models/donor.model.js";
import { ApiError } from "../../utils/ApiError.js";

const checkDonorNameExists = async (fullName) => {
  const existingDonor = await Donor.findOne({
    where: { fullName },
  });
  if (existingDonor)
    throw ApiError.conflict("Donor with this same Name already exists");
};

const checkDonorExists = async (donorId) => {
  const donorExists = await Donor.findOne({
    where: { donorId },
  });
  if (!donorExists) throw ApiError.notFound("Donor not found");
};

export const createDonor = async (payload) => {
  const {
    fullName,
    mobileNumber,
    address,
    panNumber,
    dateOfBirth, // 'YYYY-MM-DD'
    anniversaryDate,
    assignedUserId,
    treeGuardsProvided,
    saplingsProvided,
  } = payload;

  await checkDonorNameExists(fullName);

  return await Donor.create({
    fullName,
    mobileNumber,
    address,
    panNumber,
    dateOfBirth, // 'YYYY-MM-DD'
    anniversaryDate,
    assignedUserId,
    treeGuardsProvided: treeGuardsProvided ?? 0,
    saplingsProvided: saplingsProvided ?? 0,
  });
};

export const getDonors = async (payload) => {
  const { donorId, isActive, donationGte } = payload;

  const parsedIsActive = isActive === undefined ? true : isActive === "true";

  let where = { isActive: parsedIsActive };

  if (donorId) {
    where.donorId = donorId;
  }

  let donors = await Donor.findAll({
    where,
    raw: true,
  });


  // -----------------------------
  // Get all donations in ONE query
  // -----------------------------
  const donorIds = donors.map((donor) => donor.donorId);

  const donationTotals = await Donation.findAll({
    attributes: [
      "donorId",
      [fn("SUM", col("amount")), "totalDonationAmt"],
    ],
    where: {
      donorId: {
        [Op.in]: donorIds,
      },
    },
    group: ["donorId"],
    raw: true,
  });

  // -----------------------------
  // Convert totals into a Map
  // -----------------------------
  const donationMap = new Map(
    donationTotals.map((item) => [
      item.donorId,
      Number(item.totalDonationAmt || 0),
    ])
  );

  // -----------------------------
  // Attach total donation
  // -----------------------------
  let result = donors.map((donor) => ({
    ...donor,
    totalDonationAmt: donationMap.get(donor.donorId) || 0,
  }));

  // -----------------------------
  // Apply donationGte
  // -----------------------------
  if (donationGte) {
    result = result.filter(
      (donor) => donor.totalDonationAmt >= donationGte
    );
  }

  return result;
};

export const updateDonor = async (payload) => {
  const {
    donorId,
    fullName,
    mobileNumber,
    address,
    panNumber,
    dateOfBirth,
    anniversaryDate,
    assignedUserId,
    treeGuardsProvided,
    saplingsProvided,
  } = payload;

  let updates = {};

  if (fullName) {
    await checkDonorNameExists(fullName);
    updates.fullName = fullName;
  }
  if (mobileNumber) {
    updates.mobileNumber = mobileNumber;
  }
  if (address) {
    updates.address = address;
  }
  if (panNumber) {
    updates.panNumber = panNumber;
  }
  if (dateOfBirth) {
    updates.dateOfBirth = dateOfBirth;
  }
  if (anniversaryDate) {
    updates.anniversaryDate = anniversaryDate;
  }
  if (assignedUserId) {
    updates.assignedUserId = assignedUserId;
  }
  if (treeGuardsProvided) {
    updates.treeGuardsProvided = treeGuardsProvided;
  }
  if (saplingsProvided) {
    updates.saplingsProvided = saplingsProvided;
  }

  let where = { donorId };

  return await Donor.update(updates, { where });
};

export const deleteDonor = async (payload) => {
  const { donorId } = payload;

  let where = { donorId };

  return await Donor.update({ isActive: false }, { where });
};

// DONATIONS

export const addDonation = async (payload) => {
  const {
    donorId,
    amount,
    donationDate,
    stickersPrepared,
    paymentMode,
    paymentStatus,
  } = payload;

  await checkDonorExists(donorId);

  const createData = {
    donorId,
    amount,
    availableAmount: amount,
    donationDate,
  };

  if (stickersPrepared) {
    createData.stickersPrepared = stickersPrepared;
  }
  if (paymentMode) {
    createData.paymentMode = paymentMode;
  }
  if (paymentStatus) {
    createData.paymentStatus = paymentStatus;
  }

  return await Donation.create(createData);
};

export const getDonations = async ({ donorId, from, to }) => {
  let where = {
    donorId,
    donationDate: {
      [Op.between]: [new Date(from), new Date(to)],
    },
  };

  // Run both queries simultaneously for better performance
  const [donations, totalDonationAmt] = await Promise.all([
    Donation.findAll({ where }),
    Donation.sum("amount", { where }),
  ]);

  return {
    donations, // Array of all individual records
    totalDonationAmt: totalDonationAmt || 0, // Total sum of money
  };
};

export const updateDonation = async (payload) => {
  const {
    donorId,
    donationId,
    amount,
    donationDate,
    stickersPrepared,
    paymentMode,
    paymentStatus,
  } = payload;

  const where = {
    donorId,
    donationId,
  };

  const updates = {
    amount,
    donationDate,
  };

  if (amount) {
    updates.amount = amount;
  }
  if (donationDate) {
    updates.donationDate = donationDate;
  }
  if (stickersPrepared) {
    updates.stickersPrepared = stickersPrepared;
  }
  if (paymentMode) {
    updates.paymentMode = paymentMode;
  }
  if (paymentStatus) {
    updates.paymentStatus = paymentStatus;
  }

  return await Donation.update(updates, { where });
};

export const deleteDonation = async (payload) => {
  const { donorId, donationId } = payload;

  let where = { donorId, donationId };

  return await Donation.destroy({ where });
};
