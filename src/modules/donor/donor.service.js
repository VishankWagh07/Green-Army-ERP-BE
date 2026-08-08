import { Donation, Donor } from "../../models/donor.model.js";
import { ApiError } from "../../utils/ApiError.js";
import z from "zod";

const checkDonorNameExists = async (fullName) => {
  const existingDonor = await Donor.findOne({
    where: { fullName },
  });
  if (existingDonor)
    throw ApiError.conflict("Donor with this same Name already exists");
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
  });
};

export const getDonors = async (payload) => {
  const { donorId, isActive } = payload;

  const parsedIsActive = isActive === undefined ? true : isActive === "true";

  let where = { isActive: parsedIsActive };

  if (donorId?.trim()) {
    const trimmedDonorId = donorId.trim();
    const result = z.uuidv4().safeParse(trimmedDonorId);

    if (!result.success) {
      throw ApiError.badRequest(
        "Validation failed",
        result.error?.flatten()?.fieldErrors,
      );
    }
    where.donorId = trimmedDonorId;
  }

  const donors = await Donor.findAll({ where });

  donors.forEach(async (donor) => {
    const totalDonationAmt = await Donation.sum("amount", {
      where: {
        donorId: donor.donorId,
      },
    });
    donor.totalDonationAmt = totalDonationAmt;
    console.log("TOT", totalDonationAmt);
  });

  return donors;
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
  } = payload;

  let updates = {};
  
  if(fullName) {
    await checkDonorNameExists(fullName);
    updates.fullName = fullName;
  }
  if(mobileNumber) {
    updates.mobileNumber = mobileNumber;
  }
  if(address) {
    updates.address = address;
  }
  if(panNumber) {
    updates.panNumber = panNumber;
  }
  if(dateOfBirth) {
    updates.dateOfBirth = dateOfBirth;
  }
  if(anniversaryDate) {
    updates.anniversaryDate = anniversaryDate;
  }
  if(assignedUserId) {
    updates.assignedUserId = assignedUserId;
  }

  let where = { donorId };

  return await Donor.update(updates, { where });
};

// export const deleteDonor = async (payload) => {
//   const { donorId } = payload;

//   let where = { donorId };

//   return await Donor.update({ isActive: false }, { where });
// };
