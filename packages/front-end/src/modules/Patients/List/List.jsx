import React from "react";
import styled from "styled-components";
import * as moment from "moment";
import { CardWrapper, CardBody, Link } from "../../../common/theme";
import { VirtualizedTable, Column } from "../../../common/components/Table";
import { useData } from "../../../common/providers/API.provider";
import { getBlockscoutLink } from "../../../common/utils";

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

export default function ListPatients() {
  const [{ users }] = useData();

  function renderName({ rowData }) {
    return (
      <StyledTitle>
        {rowData && rowData.firstName && rowData.lastName
          ? `${rowData.firstName} ${rowData.lastName} `
          : `Not Available`}
      </StyledTitle>
    );
  }

  function renderAddress({ rowData }) {
    return (
      <StyledTitle>
        <StyledAddress
          href={getBlockscoutLink(rowData.publicAddress, "address")}
        >
          {rowData.publicAddress}
        </StyledAddress>
      </StyledTitle>
    );
  }

  function renderDate({ rowData }) {
    return (
      <StyledDate>
        {moment(rowData.createdDate).format("dddd, MMMM Do YYYY")}
      </StyledDate>
    );
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
        rowCount={users.length}
        rowGetter={({ index }) => users[index]}
      >
        <Column
          label="Patient"
          cellRenderer={renderName}
          dataKey="id"
          width={300}
        />
        <Column
          label="Address"
          cellRenderer={renderAddress}
          dataKey="id"
          width={400}
        />
        <Column
          label="Created At"
          cellRenderer={renderDate}
          dataKey="id"
          width={300}
        />
      </StyledTable>
    </>
  );
}
