import { sendSuccess } from "../../utils/ApiResponse.js";
import { addDonation, createDonor, deleteDonation, deleteDonor, getDonations, getDonors, updateDonation, updateDonor } from "./donor.service.js";

export async function createDonorController(req, res) {
  const donor = await createDonor(req.body);

  sendSuccess(res, { statusCode: 201, data: { donor } });
}

export async function getDonorsController(req, res) {

  const donors = await getDonors({...req.query, donationGte: Number(req.query.donationGte)});

  sendSuccess(res, { statusCode: 200, data: { donors } });
}

export async function updateDonorController(req, res) {
  const { donorId } = req.params;

  const updateCount = await updateDonor({ donorId, ...req.body });

  sendSuccess(res, { statusCode: 200, data: { updateCount: updateCount[0] } });
}

export async function deleteDonorController(req, res) {
  const { donorId } = req.params;

  const deleteCount = await deleteDonor({ donorId });

  sendSuccess(res, { statusCode: 200, data: { deleteCount: deleteCount[0] } });
}

// DONATIONS

export async function addDonationController(req, res) {
  const { donorId } = req.params;

  const donation = await addDonation({ donorId, ...req.body });

  sendSuccess(res, { statusCode: 200, data: {donation} });
}

export async function getDonationsController(req, res) {
  const { donorId } = req.params;

  const data = await getDonations({ donorId, ...req.query });

  sendSuccess(res, { statusCode: 200, data });
}

export async function updateDonationController(req, res) {
  const { donorId, donationId } = req.params;

  const updateCount = await updateDonation({ donorId, donationId, ...req.body });

  sendSuccess(res, { statusCode: 200, data: {updateCount: updateCount?.[0]} });
}

export async function deleteDonationController(req, res) {
  const { donorId, donationId } = req.params;

  const deleteCount = await deleteDonation({ donorId, donationId });

  sendSuccess(res, { statusCode: 200, data: {deleteCount: deleteCount?.[0]} });
}
