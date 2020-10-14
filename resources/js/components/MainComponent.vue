<template>
  <div class="container-fluid my-5">
    <vue-progress-bar></vue-progress-bar>
    <div class="row">
      <div class="col-4">
        <div class="card sticky-top">
          <div class="card-header">
            {{ isEditMode ? "အဆက်အသွယ် ပြင်ဆင်ရန်" : "အဆက်အသွယ် အသစ်ထည့်သွင်းရန်" }}
          </div>
          <div class="card-body">
            <alert-error :form="contact" :message="errorMessage"></alert-error>
            <form @submit.prevent="store">
              <div class="form-group">
                <label for="">အမည်</label>
                <input
                  type="text"
                  v-model="contact.name"
                  class="form-control" :class="{ 'is-invalid': contact.errors.has('name') }"
                />
                <has-error :form="contact" field="name"></has-error>
              </div>
              <div class="form-group">
                <label for="">ဖုန်း နံပါတ်</label>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">09-</span>
                  </div>
                  <input
                    type="text"
                    v-model="contact.phone"
                    class="form-control" :class="{ 'is-invalid': contact.errors.has('phone') }"
                  />
                  <has-error :form="contact" field="phone"></has-error>
                </div>
              </div>
              <div class="form-group">
                <label>အီးမေးလ်</label>
                <input
                  type="email"
                  v-model="contact.email"
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label>မွေးသက္ကရာဇ်</label>
                <input type="date" v-model="contact.dob" class="form-control" />
              </div>
              <button type="submit" v-if="!isEditMode" class="btn btn-primary btn-block">
                သိမ်းဆည်းမည်
              </button>
            </form>
            
            <button
                v-if="isEditMode"
                @click="update"
                class="btn btn-success btn-block"
              >
                ပြင်ဆင်မည်
              </button>
              <button
                v-if="isEditMode"
                @click="discard"
                class="btn btn-danger btn-block"
              >
                မလုပ်တော့ပါ
              </button>
          </div>
        </div>
      </div>
      <div class="col-8">
        <!-- Search form -->
        <div class="md-form active-purple active-purple-2 mb-3">
          <input class="form-control" type="text" placeholder="နာမည် (သို့မဟုတ်) ဖုန်း နံပါတ် ထည့်၍ ရှာပါ " aria-label="Search" v-model="search" v-on:keyup="queryForSearch">
        </div>
        
        <div class="card">
          <div class="card-header">အဆက်အသွယ်များ</div>
          <div class="card-body">

            <!-- <p class="text-danger">အဆက်အသွယ်များ မရှိပါ</p> -->

            <section v-for="contact in contacts.data" :key="contact.id">
              <div class="row">
                <div class="col-3 offset-1 my-3">
                  <h4>{{ contact.name }}</h4>
                </div>
                <div class="col-5 my-3">
                  <h5 class="mt-2">
                    {{ contact.phone }}
                    <a :href="`tel:+${contact.phone}`"
                      ><i class="fas fa-phone ml-3"></i>
                    </a>
                  </h5>
                </div>
                <div class="col-2 my-3">
                 <button class="btn btn-success" @click="edit(contact)">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button class="btn btn-danger" @click="destroy(contact.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div class="row mb-5">
                <div class="col-3">
                  <span class="ml-5 text-primary">
                    [ personal information ]
                  </span>
                </div>
                <div class="col-4 my-3">
                  <span>
                  <i class="fas fa-envelope mr-3 text-primary"></i>
                  <span>{{ contact.email ?  contact.email : "အီးမေးလ် မရှိပါ !" }}</span>
                  <i class="fas fa fa-trash ml-3 text-danger" v-if="contact.email"  @click="delEmail(contact)"></i>
                  </span>
                </div>
                <div class="col-3 my-3">
                    <i class="fas fa-calendar mr-3 text-primary"></i>
                  <span>{{ contact.dob ? contact.dob : "မွေးသက္ကရာဇ် မရှိပါ !" }}</span>
                  <i class="fas fa fa-trash ml-3 text-danger" v-if="contact.dob" @click="delDob(contact)"></i>
                </div>
                <div class="col-2 my-3">
                  
                </div>
              </div>
              <hr />
            </section>
            <pagination
              :data="contacts"
              @pagination-change-page="browse"
            ></pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      search:"",
      contacts: {},
      isEditMode: false,
      errorMessage : "",
      contact: new form({
        id: "",
        name: "",
        phone: "",
        email: "",
        dob: "",
      }),
    };
  },
  methods: {
    queryForSearch(){
       this.browse();
    },
    browse(page = 1) {
      let loader = this.$loading.show({
                color : "blue"
                });
                
      this.$Progress.start()
      axios.get("/api/contacts?page=" + page+ "&search="+this.search).then((response) => {
        this.contacts = response.data;
        this.$Progress.finish()
        loader.hide()
      });
    },
    store() {
      this.$Progress.start()
      this.contact.post("/api/contacts").then((response) => {
        Toast.fire({
          icon : "success",
          title:"အဆက်အသွယ်အသစ်ကို ထည့်သွင်းလိုက်ပါပြီ !"
          });
        this.browse();
        this.contact.clear();
        this.contact.reset();
        this.$Progress.finish()
      }).catch(error=> { this.errorMessage = "အချက်အလက်ထည့်သွင်းမှု မှားယွင်းနေပါတယ်"; this.$Progress.fail()});
    },
    edit(contact) {
      this.contact.reset();
      this.contact.clear();
      this.contact.fill(contact);
      this.isEditMode = true;
    },
    discard() {
      this.isEditMode = false;
      this.browse();
      this.contact.clear();
      this.contact.reset();
    },
    update() {
      this.$Progress.start()
      this.contact.put(`/api/contacts/${this.contact.id}`).then((response) => {
        Toast.fire({
          icon : "success",
          title:"အဆက်အသွယ်ကိုပြင်ဆင်လိုက်ပါပြီ !"
          });
        this.browse();
        this.contact.clear();
        this.contact.reset();
        this.isEditMode=false;
        this.$Progress.finish()
      });
    },
    destroy(id) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: true,
      });

      swalWithBootstrapButtons
        .fire({
          title: "ဖျက်မှာသေချာပါသလား ?",
          text: "ဖျက်ပြီးလျှင်ပြန်ယူလို့မရနိုင်ပါ!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ဖျက်ပါမယ်!",
          cancelButtonText: "မဖျက်တော့ပါ!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(`/api/contacts/${id}`)
              .then((respones) => {
                this.browse();
              })
              .catch((error) => console.log(error.response.message));

            swalWithBootstrapButtons.fire(
              "ဖျက်လိုက်ပါပြီ !",
              "သင်ရွေးချယ်ခဲ့တဲ့ အဆက်အသွယ်ကို ဖျက်လိုက်ပါပြီ",
              "success"
            );
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              "မဖျက်တော့ပါ",
              "မည်သည့် အဆက်အသွယ်ကိုမှ မဖျက်ပေးခဲ့ပါ :)",
              "error"
            );
          }
        });
    },
    delDob(contact){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: true,
      });

      swalWithBootstrapButtons
        .fire({
          title: "ဖျက်မှာသေချာပါသလား ?",
          text: "ဖျက်ပြီးလျှင်ပြန်ယူလို့မရနိုင်ပါ!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ဖျက်ပါမယ်!",
          cancelButtonText: "မဖျက်တော့ပါ!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            
          this.$Progress.start();
          contact = { 
            id : contact.id,
            name : contact.name,
            email : contact.email,
            dob : ""
            };
          axios.put('/api/contacts/'+contact.id,contact).then((response) => {
            Toast.fire({
              icon : "success",
              title:"မွေးသက္ကရာဇ် ကိုဖျက်လိုက်ပါပြီ !"
              });
            
            this.contact.clear();
            this.contact.reset();
            this.isEditMode=false;
            this.browse();
            this.$Progress.finish()
          });

            swalWithBootstrapButtons.fire(
              "ဖျက်လိုက်ပါပြီ !",
              "သင်ရွေးချယ်ခဲ့တဲ့ အဆက်အသွယ်ကို ဖျက်လိုက်ပါပြီ",
              "success"
            );
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              "မဖျက်တော့ပါ",
              "မည်သည့် အဆက်အသွယ်ကိုမှ မဖျက်ပေးခဲ့ပါ :)",
              "error"
            );
          }
        });
    },
    delEmail(contact){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: true,
      });

      swalWithBootstrapButtons
        .fire({
          title: "ဖျက်မှာသေချာပါသလား ?",
          text: "ဖျက်ပြီးလျှင်ပြန်ယူလို့မရနိုင်ပါ!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ဖျက်ပါမယ်!",
          cancelButtonText: "မဖျက်တော့ပါ!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            
          this.$Progress.start();
          contact = { 
            id : contact.id,
            name : contact.name,
            email : "",
            dob : contact.dob
            };
          axios.put('/api/contacts/'+contact.id,contact).then((response) => {
            Toast.fire({
              icon : "success",
              title:"အီးမေးလ် ကိုဖျက်လိုက်ပါပြီ !"
              });
            
            this.contact.clear();
            this.contact.reset();
            this.isEditMode=false;
            this.browse();
            this.$Progress.finish()
          });

            swalWithBootstrapButtons.fire(
              "ဖျက်လိုက်ပါပြီ !",
              "သင်ရွေးချယ်ခဲ့တဲ့ အီးမေးလ်ကို ဖျက်လိုက်ပါပြီ",
              "success"
            );
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              "မဖျက်တော့ပါ",
              "မည်သည့် အီးမေးလ်ကိုမှ မဖျက်ပေးခဲ့ပါ :)",
              "error"
            );
          }
        });
    },
  },
  created() {
    this.browse();
  },
};
</script>

<style>
</style>