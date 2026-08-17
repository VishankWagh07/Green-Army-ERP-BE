import { REPORT_WISE } from "../../constants/common.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { areaWisePlantation, donorWisePlantation, overallActivityReport, radiusReport, teamActivityReport, teamWisePlantation } from "./report.service.js";

// get overall activity controller
export const overallActivityController = async (req, res) => {
    const overallActivity = await overallActivityReport(req.query);
    sendSuccess(res, { data: overallActivity });
}

// get team activity controller
export const teamActivityController = async (req, res) => {
    const teamActivity = await teamActivityReport(req.query);
    sendSuccess(res, { data: teamActivity });
}

// get team activity controller
export const plantationReportController = async (req, res) => {
    const {reportWise} = req.query;
    let plantationReport = {};

    if(reportWise === REPORT_WISE.TEAM_WISE){
        plantationReport = await teamWisePlantation(req.query);
    }
    else if(reportWise === REPORT_WISE.DONOR_WISE){
        plantationReport = await donorWisePlantation(req.query);
    }
    else if(reportWise === REPORT_WISE.AREA_WISE){
        plantationReport = await areaWisePlantation(req.query);
    }

    sendSuccess(res, { data: plantationReport });
}

// get radius reports controller
export const radiusReportController = async (req, res) => {
    const report = await radiusReport(req.query);
    sendSuccess(res, { data: report });
}

