import React, { Component } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { Icon } from "semantic-ui-react";
import { forwardRef } from "react";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import ViewColumn from "@material-ui/icons/ViewColumn";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => (
    <Clear style={{ color: "#12558f" }} {...props} ref={ref} />
  )),
  Search: forwardRef((props, ref) => (
    <Icon
      name="search"
      size="large"
      style={{ color: "#12558f" }}
      {...props}
      ref={ref}
    />
  )),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};
class Table extends Component {
  render() {
    return (
      <MaterialTable
        style={{ flexGrow: 1 }}
        components={{
          Toolbar: (props) => (
            <div>
              <div className="table-header MuiPaper-rounded MuiPaper-elevation2">
                <MTableToolbar {...props} />
              </div>
              {this.props.toolbarComponents}
            </div>
          ),
        }}
        icons={tableIcons}
        title={this.props.title}
        columns={this.props.columns}
        data={this.props.data}
        localization={{
          toolbar: {
            nRowsSelected:
              "{0} " +
              (this.props.itemType ? this.props.itemType : "row") +
              "(s) selected",
          },
        }}
        options={{
          ...{
            search: true,
            paging: false,
            rowStyle: (rowData) => ({
              backgroundColor: rowData.backgroundColor
                ? rowData.backgroundColor
                : rowData.tableData.id % 2 === 0
                ? "#FAFAFA"
                : "#FFFFFF",
            }),
            searchFieldStyle: { backgroundColor: "white", color: "black" },
          },
          ...this.props.options,
        }}
        onRowClick={this.props.onRowClick}
        onSelectionChange={this.props.onSelectionChange}
      ></MaterialTable>
    );
  }
}

export default Table;
