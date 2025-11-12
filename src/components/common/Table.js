import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const TableHeader = styled.thead`
  background-color: ${props => props.theme.colors.gray[100]};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${props => props.theme.colors.gray[50]};
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  text-align: ${props => props.align || 'left'};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[700]};
`;

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md};
  text-align: ${props => props.align || 'left'};
  border-bottom: 2px solid ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Table = ({ columns, data, onRowClick, emptyMessage = '데이터가 없습니다.' }) => {
  return (
    <TableContainer>
      <StyledTable>
        <TableHeader>
          <tr>
            {columns.map((column, index) => (
              <TableHeaderCell
                key={index}
                align={column.align}
                width={column.width}
              >
                {column.header}
              </TableHeaderCell>
            ))}
          </tr>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align={column.align}
                  >
                    {column.render && typeof column.render === 'function'
                      ? column.render(row[column.accessor], row)
                      : row[column.accessor]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default Table;