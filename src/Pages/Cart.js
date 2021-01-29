import React from "react"
import $ from "jquery"

export default class Card extends React.Component {
    constructor() {
        super()
        this.state = {
            cart: [], // untuk menyimpan list cart
            user: "", // untuk menyimpan data nama user
            total: 0, // untuk menyimpan data total belanja
        }
    }


    initCart = () => {
        // memanggil data cart pada localStorage
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }


        // memanggil data user pada localStorage
        let userName = localStorage.getItem("user")

        // kalkulasi total harga
        let totalHarga = 0;
        tempCart.map(item => {
            totalHarga += (item.harga * item.jumlahBeli)
        })

        // memasukkan data cart, user, dan total harga pada state
        this.setState({
            cart: tempCart,
            user: userName,
            total: totalHarga
        })
    }


    componentDidMount() {
        this.initCart()
    }

    Edit = (selectedItem) => {
        window.$('#modal_edit').modal('show')
        this.setState({
            jumlahBeli: selectedItem.jumlahBeli,
            action: "update",
            selectedItem: selectedItem
        })
    }

    Save = (event) => {
        event.preventDefault();
        let tempCart = this.state.cart

        if(this.state.action === "update"){
            let index = tempCart.indexOf(this.state.selectedItem)
            tempCart[index].jumlahBeli = this.state.jumlahBeli

            this.setState({cart: tempCart})
            window.$('#modal_edit').modal("hide")
            localStorage.setItem("cart",JSON.stringify(tempCart))
        }
    }

    Delete = (item) => {
        if(window.confirm("Apakah anda yakin ignin menghapus data ini?")){
            //hapus
            let tempCart = JSON.parse(localStorage.getItem("cart"))
            
            //hapus data
            tempCart.splice(item,1)
            localStorage.setItem("cart", JSON.stringify(tempCart))
        }

    }

    render() {
        return (
            <div className="container">
                <div className="card col-12 mt-2">
                    <div className="card-header bg-primary text-white">
                        <h4>Data keranjang belanja</h4>
                    </div>

                    <div className="card-body">
                        <h5 className="text-primary">
                            Nama User : {this.state.user}
                        </h5>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Nama Item</th>
                                    <th>Harga</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.judul}</td>
                                        <td>Rp {item.harga}</td>
                                        <td>{item.jumlahBeli}</td>
                                        <td>
                                            Rp {item.harga * item.jumlahBeli}
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-primary mx-2" onClick={() => this.Edit(item)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-sm btn-danger " onClick={() => this.Delete(item)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h4 className="text-danger">
                            Total Harga: Rp {this.state.total}
                        </h4>       
                    </div>
                </div>
                <div className="modal" id="modal_edit">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            {/** Modal Header */}
                            <div className="modal-header">
                                Jumlah Beli
                            </div>
                            {/** modal body */}
                            <div className="modal-body">
                                <form onSubmit={ev => this.Save(ev)}>
                                    Masukkan jumlah beli <br/>
                                    <input type="number" className="form-control mb-2"
                                    value={this.state.jumlahBeli} 
                                    onChange={ev => this.setState({jumlahBeli : ev.target.value})}
                                    required/>
                                    <button className="btn btn-info btn-block" type="submit">
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}