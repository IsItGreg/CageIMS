import React, { Component } from "react";
import "datatables.net";

const $ = require("jquery");
$.DataTable = require("datatables.net");

class Table extends Component {
  componentDidMount() {
    console.log(this.el);
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.props.data,
      columns: this.props.columns,
    });
  }
  componentWillUnmount() {
    $(".data-table-wrapper").find("table").DataTable().destroy(true);
  }
  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css"
        ></link>
        <script
          type="text/javascript"
          charset="utf8"
          src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.js"
        ></script>
        <table
          id="main"
          class="display row-border"
          width="100%"
          ref={(el) => (this.el = el)}
        ></table>
      </div>
    );
  }
}

export default Table;
