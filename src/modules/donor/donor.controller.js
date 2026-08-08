import { sendSuccess } from "../../utils/ApiResponse.js";
import { createDonor, getDonors, updateDonor } from "./donor.service.js";

export async function createDonorController(req, res) {
  const donor = await createDonor(req.body);

  sendSuccess(res, { statusCode: 201, data: { donor } });
}

export async function getDonorsController(req, res) {
  const { donorId, isActive } = req.query;

  const donors = await getDonors({ donorId, isActive });

  sendSuccess(res, { statusCode: 200, data: { donors } });
}

export async function updateDonorController(req, res) {
  const { donorId } = req.params;

  const updateCount = await updateDonor({ donorId, ...req.body });

  sendSuccess(res, { statusCode: 200, data: { updateCount: updateCount[0] } });
}

// export async function deleteDonorController(req, res) {
//   const { donorId } = req.params;

//   const deleteCount = await deleteDonor({ donorId });

//   sendSuccess(res, { statusCode: 200, data: { deleteCount: deleteCount[0] } });
// }
