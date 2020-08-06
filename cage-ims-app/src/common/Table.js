import React, { Component } from "react";
import MaterialTable, { MTableToolbar, M } from "material-table";
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
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
  MuiThemeProvider,
} from "@material-ui/core/styles";

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
    <Clear style={{ color: "white" }} {...props} ref={ref} />
  )),
  Search: forwardRef((props, ref) => (
    <Search style={{ color: "white" }} {...props} ref={ref} />
  )),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};
class Table extends Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    return (
      <MaterialTable
        style={{ flexGrow: 1 }}
        components={{
          Toolbar: (props) => (
            <div class={"table-header MuiPaper-rounded MuiPaper-elevation2"}>
              <MTableToolbar {...props} />
            </div>
          ),
          Search: (props) => <div style={{ color: "white" }}></div>,
        }}
        icons={tableIcons}
        title={this.props.title}
        columns={this.props.columns}
        data={this.props.data}
        options={{
          search: true,
          paging: false,
          rowStyle: (rowData) => ({
            backgroundColor: rowData.backgroundColor
              ? rowData.backgroundColor
              : rowData.tableData.id % 2 === 0
              ? "#FAFAFA"
              : "#FFFFFF",
          }),
        }}
        onRowClick={this.props.onRowClick}
      ></MaterialTable>
    );
  }
}

export default Table;
