import React, { Component } from "react";

import plus from "./assets/svgs/plus4.svg";
import deletec from "./assets/svgs/deletecolor.svg";

import Papa from "papaparse";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.importCSV = this.importCSV.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);
    this.handleChangeRow = this.handleChangeRow.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleDeleteRow = this.handleDeleteRow.bind(this);
    this.ArrayToCSV = this.ArrayToCSV.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
  }

  //function to import csv and read data using papaparse
  importCSV = (csvfile) => {
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true,
    });
  };

  //call import csv function when onclick upload csv
  handleChange = (event) => {
    this.importCSV(event.target.files[0]);
  };

  //update data after reading csv
  updateData(result) {
    const data = result.data;

    console.log("start", data);
    // Validating data
    data.map((object) =>
      Object.keys(object).forEach((key) => {
        const value = object[key];
        delete object[key];
        if (value !== "") {
          object[key.toLowerCase()] = value;
        }
      })
    );
    this.setState((prev) => {
      return {
        ...prev,
        data: [...data],
      };
    });
    this.handleToast("csv uploaded Successfully");
  }

  //editing the row
  handleChangeRow = (index, e) => {
    const { name, value } = e.target;
    const assign = this.state.data;
    const currentRows = [...assign];
    currentRows[index][name] = value;
    this.setState((prev) => {
      return {
        ...prev,
        data: [...currentRows],
      };
    });
  };

  //converting array to csv format text
  ArrayToCSV = () => {
    const { data } = this.state;
    let csv = "";
    let header = Object.keys(data[0]).join(",");
    let values = data.map((o) => Object.values(o).join(",")).join("\n");
    csv += header + "\n" + values;
    console.log("csv", csv);
    this.downloadCSV(csv);
  };

  // creating csv file and downloading
  downloadCSV = (csvData) => {
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvData);
    hiddenElement.target = "_blank";
    hiddenElement.download = "output.csv";
    hiddenElement.click();
    this.handleToast("csv Downloaded Successfully");
  };

  //Add row
  handleAddRow = () => {
    const newRow = {
      title: "",
      author: "",
      subject: "",
      publisher: "",
      quantity: "",
      price: "",
    };

    //react set local state
    this.setState((prev) => {
      return {
        ...prev,
        data: [...prev.data, newRow],
      };
    });
  };

  //for toast messages
  handleToast = (msg) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      progress: undefined,
    });
  };

  //delete row
  handleDeleteRow(index) {
    const currentRows = [...this.state.data];
    currentRows.splice(index, 1);
    this.setState((prev) => {
      return {
        ...prev,
        data: [...currentRows],
      };
    });
  }

  render() {
    return (
      <div className="sm:m-5 m-2">
        <div className="flex flex-col justify-center items-center sm:p-8 p-2">
          <label className="mb-0">
            <h6 className="mb-2 font-poppins text-slate-200 text-2xl bg-cyan-700 px-3 py-1 rounded-lg font-semibold">
              Create Your Own Database Here
            </h6>
          </label>
          <div className="flex pt-3 ml-10">
            <input
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              type="file"
              ref={(input) => {
                this.filesInput = input;
              }}
              name="file"
              placeholder={null}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="flex-col">
          <div className="flex justify-start">
            <button
              onClick={() => this.handleAddRow()}
              className={`flex items-center mr-auto text-white bg-cyan-700 hover:bg-cyan-800  
            font-medium rounded-lg text- md:text-md pr-2 py-1
            `}
            >
              <img
                src={plus}
                title="Add Row"
                className="h-4 w-4 mx-2"
                alt="plus"
              />
              Add rows
            </button>
            <button
              onClick={this.ArrayToCSV}
              className="text-white bg-gray-700 hover:bg-cyan-800 font-medium rounded-lg md:text-md px-3 py-1"
            >
              Download CSV
            </button>
          </div>
          <>
            {this.state.data.length !== 0 ? (
              <div className="flex items-start  p-2 h-[500px] overflow-auto">
                <table className="sm:text-sm text-left w-full">
                  <thead className="sm:text-sm text-[9px] shadow-sm uppercas">
                    <tr>
                      <th className="p-1">S.No</th>
                      <th className="p-1">Title</th>
                      <th className="p-1">Author</th>
                      <th className="p-1">Subject</th>
                      <th className="p-1">Publisher</th>
                      <th className="p-1">Quantity</th>
                      <th className="p-1">Price</th>
                      <th className="p-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.data.map((student, index) => (
                      <tr key={`student-${index}`} className="w-full">
                        <td className="p-1 w-1/16">
                          <input
                            className="w-full shadow appearance-none border rounded py-2 px-3 
                        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            readOnly
                            value={index + 1}
                            type="text"
                            placeholder="S.No"
                          />
                        </td>
                        <td className="p-1 w-1/8">
                          <input
                            name="title"
                            onChange={(e) => this.handleChangeRow(index, e)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 
                        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={student.title}
                            type="text"
                            placeholder="Title"
                          />
                        </td>
                        <td className="p-1  w-1/8">
                          <input
                            name="author"
                            onChange={(e) => this.handleChangeRow(index, e)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 
                        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={student.author}
                            type="text"
                            placeholder="Author"
                          />
                        </td>
                        <td className="p-1  w-1/8">
                          <input
                            name="subject"
                            onChange={(e) => this.handleChangeRow(index, e)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 
                        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={student.subject}
                            type="text"
                            placeholder="Subject"
                          />
                        </td>
                        <td className="p-1  w-1/8">
                          <input
                            name="publisher"
                            onChange={(e) => this.handleChangeRow(index, e)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 
                        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={student.publisher}
                            type="text"
                            placeholder="Publisher"
                          />
                        </td>
                        <td className="p-1  w-1/8">
                          <input
                            name="quantity"
                            onChange={(e) => this.handleChangeRow(index, e)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 
                        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={student.quantity}
                            type="text"
                            placeholder="Quantity"
                          />
                        </td>
                        <td className="p-1  w-1/8">
                          <input
                            name="price"
                            onChange={(e) => this.handleChangeRow(index, e)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 
                        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={student.price}
                            type="text"
                            placeholder="Price"
                          />
                        </td>
                        <td className="p-1 w-1/16">
                          <div className="flex sm:gap-x-3 gap-x-1 items-center">
                            <img
                              alt="delete"
                              src={deletec}
                              title="Delete Response"
                              className="ml-2 sm:w-5 sm:h-5 w-4 h-4 hoverPointer"
                              onClick={() => {
                                this.handleDeleteRow(index);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <h1 className="font-poppins text-left text-xl text-cyan-700 font-semibold py-3">
                  Features of our Application
                </h1>
                <ul className="font-medium font-poppins text-orange-700">
                  <li>
                    1. You can edit the rows by uploading the previous csv here
                  </li>
                  <li>
                    2. You can also start creating your csv table by clicking on
                    add rows button then start editing your rows.
                  </li>
                  <li>
                    3. You can download your database table in csv format by
                    clicking on download csv button.
                  </li>
                  <li>
                    4. You can also delete, add and edit the rows in your csv
                    file
                  </li>
                </ul>
              </div>
            )}
          </>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default App;
