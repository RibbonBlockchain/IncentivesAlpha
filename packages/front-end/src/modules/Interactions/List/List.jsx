import React from "react";
import styled from "styled-components";
import * as moment from "moment";
import { CardWrapper, CardBody, Link, Heading } from "../../../common/theme";
import { VirtualizedTable, Column } from "../../../common/components/Table";
import { useData } from "../../../common/providers/API.provider";
import {
  getBlockscoutLink,
  formatToUsd,
  formatTokenBalance
} from "../../../common/utils";

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;
const StyledTitle = styled.h3`
  font-weight: 300;
`;
const StyledDate = styled(StyledTitle)``;

const StyledAddress = styled(Link)``;

const StyledTable = styled(VirtualizedTable)``;

export default function ListInteractions() {
  const [{ interactions }] = useData();

  function renderPatient({ rowData }) {
    return (
      <Heading>
        {rowData.patient &&
        rowData.patient.firstName &&
        rowData.patient.lastName
          ? `${rowData.patient.firstName} ${rowData.patient.lastName} `
          : `Not Available`}
      </Heading>
    );
  }

  function renderPractitioner({ rowData }) {
    return (
      <Heading>
        {rowData.practitioner &&
        rowData.practitioner.firstName &&
        rowData.practitioner.lastName
          ? `${rowData.practitioner.firstName} ${rowData.practitioner.lastName} `
          : `Not Available`}
      </Heading>
    );
  }

  function renderHealthWorker({ rowData }) {
    return (
      <Heading>
        {rowData.chw && rowData.chw.firstName && rowData.chw.lastName
          ? `${rowData.chw.firstName} ${rowData.chw.lastName} `
          : `Not Available`}
      </Heading>
    );
  }

  function renderDate({ rowData }) {
    return (
      <Heading>
        {rowData.createdDate
          ? moment(rowData.createdDate)
              .utc()
              .format("dddd, MMMM Do YYYY HH:mm")
          : "Not Available"}
      </Heading>
    );
  }

  function renderTotalTokenSent({ rowData }) {
    let totalTokenSent =
      rowData.rewards[0].chwReward +
      rowData.rewards[0].patientReward +
      rowData.rewards[0].practitionerReward;
    return <Heading>{totalTokenSent}</Heading>;
  }

  return (
    <>
      <StyledContainer>
        <CardWrapper>
          <CardBody>0</CardBody>
          <CardBody>Patients Registered</CardBody>
        </CardWrapper>
        <CardWrapper>
          <CardBody>0</CardBody>
          <CardBody>Patients Registered</CardBody>
        </CardWrapper>
        <CardWrapper>
          <CardBody>0</CardBody>
          <CardBody>Patients Registered</CardBody>
        </CardWrapper>
        <CardWrapper>
          <CardBody>0</CardBody>
          <CardBody>Patients Registered</CardBody>
        </CardWrapper>
      </StyledContainer>
      <StyledTable
        headerHeight={40}
        rowHeight={40}
        rowCount={interactions.length}
        rowGetter={({ index }) => interactions[index]}
      >
        <Column
          label="Practitioner"
          cellRenderer={renderPractitioner}
          dataKey="practitionerAddress"
          width={300}
        />
        <Column
          label="Patient"
          cellRenderer={renderPatient}
          dataKey="patientAddress"
          width={300}
        />
        <Column
          label="Registered By"
          cellRenderer={renderHealthWorker}
          dataKey="chwAddress"
          width={200}
        />
        <Column
          label="Total tokens sent"
          cellRenderer={renderTotalTokenSent}
          dataKey="rewards"
          width={200}
        />
        <Column
          label="Date"
          cellRenderer={renderDate}
          dataKey="createdDate"
          width={300}
        />
      </StyledTable>
    </>
  );
}
