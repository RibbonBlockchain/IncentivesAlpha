import styled, { keyframes, css } from "styled-components";
import { darken } from "polished";
import { remUnit, getWidth, getFlex } from "../utils";

export const Button = styled.button.attrs(({ warning, theme }) => ({
  backgroundColor: warning ? theme.salmonRed : theme.royalBlue
}))`
  padding: 1rem 2rem 1rem 2rem;
  border-radius: 3rem;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ theme }) => theme.white};
  width: 100%;
  :hover,
  :focus {
    background-color: ${({ backgroundColor }) => darken(0.05, backgroundColor)};
  }
  :active {
    background-color: ${({ backgroundColor }) => darken(0.1, backgroundColor)};
  }
  :disabled {
    background-color: ${({ theme }) => theme.concreteGray};
    color: ${({ theme }) => theme.silverGray};
    cursor: auto;
  }
`;

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer"
})`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.royalBlue};
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`;

export const BorderlessInput = styled.input`
  color: ${({ theme }) => theme.textColor};
  font-size: 1rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: ${({ theme }) => theme.inputBackground};
  [type="number"] {
    -moz-appearance: textfield;
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  ::placeholder {
    color: ${({ theme }) => theme.chaliceGray};
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.img`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`;

export const CardWrapper = styled.div`
  overflow: hidden;
  padding: 0 0 32px;
  width: 100%;
  cursor: pointer;
  perspective: 1000px;
  transition: all .25s ease-in-out;
  font-family: Quicksand, arial, sans-serif;
  background: ${({ bgColor, theme }) =>
    bgColor ? bgColor : theme.backgroundColor}
  border-radius: 0.5rem;
  &:focus,
  &:hover {
    // box-shadow: 0 0 ${remUnit(40)} rgba(0,0,0,.15);
  }
`;

export const CardHeader = styled.header`
  padding-top: 32px;
//   color: ${({ theme }) => theme.backgroundColor}
  padding-bottom: 32px;
`;

export const CardHeading = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

export const CardBody = styled.div`
  padding-right: 32px;
  padding-left: 32px;
`;

export const CardFieldset = styled.fieldset`
  position: relative;
  padding: 0;
  margin: 0;
  border: 0;

  & + & {
    margin-top: 24px;
  }

  &:nth-last-of-type(2) {
    margin-top: 32px;
  }

  &:last-of-type {
    text-align: center;
  }
`;

export const CardInput = styled.input`
  padding: 7px 0;
  width: 100%;
  font-family: inherit;
  font-size: 14px;
  border-top: 0;
  border-right: 0;
  border-bottom: 1px solid #ddd;
  border-left: 0;
  transition: border-bottom-color 0.25s ease-in;

  &:focus {
    border-bottom-color: #e5195f;
    outline: 0;
  }
`;

export const CardIcon = styled.span`
  color: #666;
  cursor: pointer;
  opacity: .25;
  transition: opacity .25s ease-in;

  &:hover {
    opacity: .95;
  }

  ${props =>
    props.big &&
    css`
      font-size: 26px;
    `}

  ${props =>
    props.eye &&
    css`
      position: absolute;
      top: 8px;
      right: 0;
    `}

  ${props =>
    props.small &&
    css`
      font-size: 14px;
    `}
`;

export const CardOptionsNote = styled.small`
  padding-top: 8px;
  display: block;
  width: 100%;
  font-size: 12px;
  text-align: center;
  text-transform: uppercase;
`;

export const CardOptions = styled.ul`
  padding: 0;
  margin: 16px 0 8px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  list-style-type: none;
`;

export const CardOptionsItem = styled.li`
  &:nth-of-type(n + 2) {
    margin-left: 16px;
  }
`;

export const CardButton = styled.button`
  display: block;
  width: 100%;
  padding: 12px 0;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background-color: #e5195f;
  border: 0;
  border-radius: 35px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);

  &:hover {
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.16);
    transform: translate(0, -5px);
  }
`;

export const CardLink = styled.a`
  display: inline-block;
  font-size: 12px;
  text-decoration: none;
  color: #aaa;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: color 0.25s ease-in;

  &:hover {
    color: #777;
  }
`;

export const Wrapper = styled.div`
  margin: 0.5rem 0;
`;

export const TableWrapper = styled.div`
  outline: none;
  max-height: 50vh;
  margin: 2rem 0;
  color: ${({ theme }) => theme.backgroundColor};
  .ReactVirtualized__Table {
    outline: none;
  }

  .ReactVirtualized__Table__headerColumn {
    font-size: 0.8rem;
    font-weight: 500;
  }

  .ReactVirtualized__Table__headerRow {
    border: 1px solid gray;
  }

  .ReactVirtualized__Table__row {
    border-bottom: 1px solid gray;
    font-weight: 300;
    font-size: 0.8rem;
    outline: none;
  }

  .ReactVirtualized__Table__rowColumn {
  }

  .ReactVirtualized__Table__sortableHeaderColumn {
  }

  .ReactVirtualized__Table__sortableHeaderIcon {
  }
`;

export const ModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  opacity: 0;
  background: rgba(255, 255, 255, 0.5);
  z-index: 4096;
  border-bottom: 1px solid #e3ebf6;
  transition-property: opacity;
  transition-duration: 0.25s;
  &.active {
    pointer-events: auto;
    opacity: 1;
  }
`;

export const Modal = styled.div`
  line-height: normal;
  position: relative;
  border-radius: 16px;
  box-shadow: 0px 2px 16px rgba(0, 9, 26, 0.12);
  overflow-x: hidden;
  background: ${({ theme }) => theme.textColor}
  color: ${({ theme }) => theme.backgroundColor}
  width: ${props => {
    switch (props.modalSize) {
      case "xs":
      case "sm":
        return "480";
      case "md":
        return 600;
      case "lg":
        return "800";
      default:
        return "480";
    }
  }}px;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  margin: 0 0 1rem 0;
`;
export const ModalHeading = styled.h4`
  margin: 0;
`;
export const CloseButton = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 8px;
  top: 8px;
  color: #fff;
  font-family: "Times New Roman", Times, serif !important;
  font-size: 22px;
  font-weight: 700;
  border-radius: 50%;
  background: #939ba1;
  cursor: pointer;
  transform: rotate(45deg);
  //   z-index: 999;
`;
export const ModalBody = styled.div`
  padding: 2rem;
`;

export const Heading = styled.h3`
  font-weight: 300;
`;

export const GridContainer = styled.div`
  padding-right: ${remUnit(30)};
  padding-left: ${remUnit(30)};
  margin-right: auto;
  margin-left: auto;
  width: 100%;

  // Breakpoint for tablets
  @media (min-width: 576px) {
    max-width: ${remUnit(540)};
  }

  // Breakpoint for small desktops
  @media (min-width: 768px) {
    max-width: ${remUnit(720)};
  }

  // Breakpoint for medium desktops
  @media (min-width: 992px) {
    max-width: ${remUnit(9600)};
  }

  // Breakpoint for large desktops and HD devices
  @media (min-width: 1200px) {
    max-width: ${remUnit(1140)};
  }
`;

// Grid row
export const GridRow = styled.div`
  margin-right: ${remUnit(-15)};
  margin-left: ${remUnit(-15)};
  display: flex;
  flex-wrap: wrap;
`;

// Grid columns
export const GridColumn = styled.div`
  padding-right: ${remUnit(15)};
  padding-left: ${remUnit(15)};

  // Columns for mobile
  ${({ xs }) => (xs ? getFlex(xs) : "flex: 0 0 100%")};
  ${({ xs }) => (xs ? getWidth(xs) : "width: 100%")};

  // Columns for tablets
  @media (min-width: 576px) {
    ${({ sm }) => sm && getFlex(sm)};
    ${({ sm }) => sm && getWidth(sm)};
  }

  // Columns for small desktops
  @media (min-width: 768px) {
    ${({ md }) => md && getFlex(md)};
    ${({ md }) => md && getWidth(md)};
  }

  // Columns for medium desktops
  @media (min-width: 992px) {
    ${({ lg }) => lg && getFlex(lg)};
    ${({ lg }) => lg && getWidth(lg)};
  }

  // Columns for large desktops and HD devices
  @media (min-width: 1200px) {
    ${({ xl }) => xl && getFlex(xl)};
    ${({ xl }) => xl && getWidth(xl)};
  }
`;

export const StyledTitle = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  span {
    font-size: 1.5rem;
  }
`;
