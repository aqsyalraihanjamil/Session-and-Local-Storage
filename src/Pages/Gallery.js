import React, {Component} from "react"
import Card from "../Components/Card"
import $ from "jquery"
class Gallery extends React.Component{
    constructor(){
        super()
        this.state = {
            buku : [
                {
                    isbn:"12345", judul:"Bulan", penulis:"Tere Liye ",
                    penerbit:"CV Harapan Kita", harga: 90000,
                    cover:"https://drive.google.com/uc?id=1ui-jyKgu3DqFyo7VKJu-FFXkaNQN3aSg"
                },
                {
                    isbn:"12346", judul:"Anak Badai", penulis:"Tere Liye",
                    penerbit:"CV Nusa Bangsa", harga: 80000,
                    cover:"https://drive.google.com/uc?id=1rJDcCOmsd14NL6DG3Wps_kewZomGcLU-"
                },
                {
                    isbn:"54321", judul:"Bumi", penulis:"Tere Liye",
                    penerbit:"CV Nusa Bangsa", harga:70000,
                    cover:"https://drive.google.com/uc?id=1e-thvq7lkG1_gw0FqHzRoiAhfhdgpOUj"
                }
            ],
            action:"",
            isbn:"",
            judul:"",
            penulis:"",
            penerbit:"",
            harga:0,
            cover:"",
            selectedItem: null,
            keyword:"",
            filterBuku:[],
            user:"",
        }
        this.state.filterBuku = this.state.buku
    }

    Add = () => {
        //menaimpilkan komponen modal
        window.$("#modal_buku").modal("show")
        this.setState({
            isbn: Math.random(1,100000),
            judul: "",
            penulis: "",
            penerbit: "",
            harga:0,
            cover:'',
            action:"insert"
        })
    }

    Edit = (item) => {
        //menampilkan komponene modal
        window.$("#modal_buku").modal("show")
        this.setState({
            isbn: item.isbn,
            judul: item.judul,
            penulis: item.penulis,
            penerbit: item.penerbit,
            cover:item.cover,
            harga:item.harga,
            action:"update",
            selectedItem: item
        })
    }

    Save = (event) => {
        event.preventDefault();
        // menampung data state buku
        let tempBuku = this.state.buku

        if(this.state.action === "insert"){
        // menambha data baru
        tempBuku.push({
            isbn: this.state.isbn,
            judul : this.state.judul,
            penulis: this.state.penulis,
            penerbit: this.state.penerbit,
            cover: this.state.cover,
            harga: this.state.harga,
        })
    }else if(this.state.action === "update"){
        //menyimpan perubahan data
        let index = tempBuku.indexOf(this.state.selectedItem)
        tempBuku[index].isbn = this.state.isbn
        tempBuku[index].judul = this.state.judul
        tempBuku[index].penulis = this.state.penulis
        tempBuku[index].penerbit = this.state.penerbit
        tempBuku[index].cover = this.state.cover
        tempBuku[index].harga = this.state.harga
        this.setState({buku : tempBuku})
        // menutup komponen modal_buku
        window.$('#modal_buku').modal("hide")   
    }
}

    Drop = (item) => {
        // beri konfirmasi untuk menghapus data
        if(window.confirm("Apakah anda yakin ignin menghapus data ini?")){
            //hapus
            let tempBuku = this.state.buku
            //posisi index yang akan dihapus
            let index = tempBuku.indexOf(item)

            //hapus data
            tempBuku.splice(index,1)
            this.setState({buku: tempBuku});
        }
    }

    searching = event => {
        if(event.keyCode === 13){
            // 13 adalah kode untuk tombol enter

            let keyword = this.state.keyword.toLowerCase()
            let tempBuku = this.state.buku
            let result = tempBuku.filter(item => {
                return item.judul.toLowerCase().includes(keyword) ||
                item.penulis.toLowerCase().includes(keyword)||
                item.penerbit.toLowerCase().includes(keyword)
            })
            this.setState({filterBuku: result})
        }
    }

    setUser = () => {
        //cek isi dari session storage
        if(localStorage.getItem("user") === null){
            //cek kondisi
            let prompt = window.prompt("Masukkan nama anda","")
            if(prompt === null || prompt === ""){
                //kondisi tidak mengisi
                this.setUser()
            }else{
                // jika user telah mengisi
                localStorage.setItem("user", prompt)

                //simpan nama user ke state.user
                this.setState({user:prompt})
            }
        }else{
            //kondisi jika telah mengisi user
            let name = localStorage.getItem("user")
            this.setState({user:name})
        }
    }

    componentDidMount(){
        this.setUser()
    }

    addToCart = (selectedItem) => {
        let tempCart = []
        //kondisi jika cart memiliki value
        if(localStorage.getItem("cart") != null){
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }
        //cek data yg dipilih
        let existItem = tempCart.find(item => item.isbn === selectedItem.isbn)
        if(existItem){
            window.alert("Anda telah memilih item ini")
        }else{
            let promptJumlah = window.prompt("Masukkan jumlah item yang dibeli", "")
            if(promptJumlah !== null && promptJumlah !== ""){

                selectedItem.jumlahBeli = promptJumlah
                tempCart.push(selectedItem)

                localStorage.setItem("cart", JSON.stringify(tempCart))
            }
        }
    }


    render(){
        return(
            <div className="container">
                <h4 className="text-info my-2">
                    Nama Pengguna : { this.state.user }
                </h4>
                <input type="text" className="form-control my-2" placeholder="Pencarian"
                value={this.state.keyword}
                onChange={ev => this.setState({keyword: ev.target.value})}
                onKeyUp={ev => this.searching(ev)}/>
                <div className="row">
                    {this.state.filterBuku.map((item,index) => (
                        <Card 
                        judul={item.judul}
                        penulis={item.penulis}
                        penerbit={item.penerbit}
                        harga={item.harga}
                        cover={item.cover}
                        onEdit={ () => this.Edit(item)}
                        onDrop={() => this.Drop(item)}
                        onCart={() => this.addToCart(item)}
                        />
                    ))}
                </div>
                <button className="btn btn-success" onClick={() => this.Add()} > 
                    Tambah Data
                </button>
                {/** component modal sebagai cnotrol manipulasi data */}
                <div className="modal" id="modal_buku">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            {/** Modal Header */}
                            <div className="modal-header">
                                Form Buku
                            </div>
                            {/** modal body */}
                            <div className="modal-body">
                                <form onSubmit={ev => this.Save(ev)}>
                                    Judul Buku
                                    <input type="text" className="form-control mb-2"
                                    value={this.state.judul} 
                                    onChange={ev => this.setState({judul : ev.target.value})}
                                    required/>
                                    Penulis Buku 
                                    <input type="text" className="form-control mb-2"
                                    value={this.state.penulis} 
                                    onChange={ev => this.setState({penulis : ev.target.value})}
                                    required/>
                                    Penerbit Buku
                                    <input type="text" className="form-control mb-2"
                                    value={this.state.penerbit} 
                                    onChange={ev => this.setState({penerbit : ev.target.value})}
                                    required/>
                                    Harga Buku
                                    <input type="number" className="form-control mb-2"
                                    value={this.state.harga}
                                    onChange={ ev => this.setState({harga: ev.target.value}) }
                                    required />
                                    Cover Buku
                                    <input type="url" className="form-control mb-2"
                                    value={this.state.cover} 
                                    onChange={ev => this.setState({cover : ev.target.value})}
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

export default Gallery;

