import React from "react";
import { Table, TableColumnsType, TableProps } from "antd";
import "./Table.scss";
import { ThreeDots } from "react-loader-spinner";

interface DataType {
  key: React.Key;
}

type ReusableTableProps<T extends DataType> = TableProps<T> & {
  columns: TableColumnsType<T>;
  dataSource: T[];
  rowSelection?: TableProps<T>["rowSelection"];
  loading?: boolean;
  noDataComponent?: React.ReactNode;
  onRow?: TableProps<T>["onRow"];
  rowClassName?: TableProps<T>["rowClassName"];
  pagination?: TableProps<T>["pagination"];
  tableStyle?: React.CSSProperties;
  expandable?: TableProps<T>["expandable"];
};

const ReusableTable = <T extends DataType>({
  columns,
  dataSource,
  rowSelection,
  loading = false,
  noDataComponent,
  onRow,
  rowClassName,
  pagination = false,
  tableStyle,
  expandable,
  ...props
}: ReusableTableProps<T>) => {
  const CustomLoader = (
    <ThreeDots
      visible={true}
      height="50"
      width="50"
      color="#d52b1e"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    />
  );

  return (
    <div className="tableWrapper">
      <Table<T>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        loading={{
          spinning: loading,
          indicator: CustomLoader,
        }}
        pagination={pagination}
        style={tableStyle || { height: "fit-content" }}
        locale={{
          emptyText: noDataComponent,
        }}
        onRow={onRow}
        rowClassName={rowClassName}
        expandable={expandable}
        {...props}
      />
    </div>
  );
};

export default ReusableTable;
