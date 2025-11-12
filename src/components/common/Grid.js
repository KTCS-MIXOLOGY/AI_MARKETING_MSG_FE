import React from 'react';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 1}, 1fr);
  gap: ${props => props.gap || props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(${props => props.mdColumns || props.columns || 1}, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(${props => props.smColumns || props.mdColumns || props.columns || 1}, 1fr);
  }
`;

const Grid = ({ children, columns = 1, mdColumns, smColumns, gap, ...props }) => {
  return (
    <GridContainer
      columns={columns}
      mdColumns={mdColumns}
      smColumns={smColumns}
      gap={gap}
      {...props}
    >
      {children}
    </GridContainer>
  );
};

export default Grid;