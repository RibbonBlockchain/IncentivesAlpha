import * as moment from "moment";

export const filters = (requestQuery) => {
    const date_from = requestQuery['date_from'];
    const date_to = requestQuery['date_to'];
    const date = requestQuery['date'];
    const patient = requestQuery['patient_id'];
    const practitioner = requestQuery['practitioner_id'];
    const chw = requestQuery['chw_id'];
    let options = {};
    if(date_from){
        if(!options["createdDate"]) options["createdDate"] = {};
        const dateFrom = moment(new Date(date_from)).toDate();
        options["createdDate"]['$gte'] = dateFrom;
    }

    if(date_to){
        if(!options["createdDate"]) options["createdDate"] = {};
        const dateTo = moment(new Date(date_to)).toDate();
        options["createdDate"]['$lte'] = dateTo;
    }

    if(date) {
    if(!options["createdDate"]) options["createdDate"] = {};
    const dDate = moment(new Date(date)).toDate()
    options["createdDate"] = dDate
    }

    if(patient){
    if(!options["patient"]) options["patient"] = {};
    options["patient"] = patient;
    }

    if(practitioner){
    if(!options["practitioner"]) options["practitioner"] = {};
    options["practitioner"] = practitioner;
    }

    if(chw){
    if(!options["chw"]) options["chw"] = {};
    options["chw"] = chw;
    }

    return options
}