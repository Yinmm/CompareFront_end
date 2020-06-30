<template>
  <div id="app">
    <div id="nav">
      <el-container style="background-color:white">
        <el-header style="display:flex">
          <span style="float:left">数据上传</span>
        </el-header>
        <el-main>
          <el-card>
            <!-- 筛选栏 -->
            <div style="display:inline-block">   
              <div style="float:left;margin-top:0px">   
                <el-select v-model="uploadAgent" placeholder="选择平台" style="margin-top:-20px;margin-left:0px" @change="selectUrl">
                  <el-option v-for="item in optionAgent" :key="item" :label="item" :value="item"> </el-option>
                </el-select>
              </div>
              <!--上传文件-->
              <div style="margin:-7px 0px 0 10px;float:left">
                <el-upload 
                  ref="upload"
                  drag
                  :action="url"
                  multiple
                  :with-credentials="true"
                  :on-success="upFile"
                  :on-remove="handleRemove"
                  :auto-upload="false"
                  accept=".xlsx">
                  <i class="el-icon-upload" style="margin-top:10px"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
              </div>
              <div style="float:right;margin-top:85px;margin-left:30px">
                <el-button type="primary"  @click="submitUpload">提交</el-button>    
              </div>          
            </div>
            <el-divider></el-divider>
            <!-- 版本数据 -->
            <template>
              <el-table ref="reportTable" :data="tableData" style="width: 100%;cursor:pointer" highlight-current-row    @selection-change="getServalReport">>
                <!-- <el-table-column type="index" label="序号"></el-table-column> -->
                <el-table-column type="selection"></el-table-column>
                <el-table-column  label="项目" width="auto"> 
                  <div slot-scope="scope" class="project">
                      <span style="margin-left:10px ;font-weight:bold;color:blue" @click="Report(scope.row)">{{scope.row.GameName}}</span>
                  </div>
                </el-table-column>
                <el-table-column prop="Version" sortable label="版本"  width="auto"></el-table-column>
                <el-table-column prop="name" sortable label="设备"  width="auto"></el-table-column>
                <el-table-column  prop="testDate" sortable label="测试日期" width="auto"></el-table-column>
                 <el-table-column  prop="testDate" sortable label="测试时长(min)" width="300"></el-table-column>
                <el-table-column  prop="FPS_avg" label="Fps" > </el-table-column>
                <el-table-column prop="CPU_avg" label="Cpu[%]" > </el-table-column>
                <el-table-column prop="Memory_avg" label="Memory[MB]" ></el-table-column>  
                <el-table-column prop="Net_avg" label="流量[kb]" ></el-table-column>                
                <el-table-column prop="Ele_avg" label="耗电量[mAh]" ></el-table-column>    
                <el-table-column prop="Tem_avg" label="温度[℃]"></el-table-column>                                          
              </el-table>
            </template>
            <div style="margin-top:40px;margin-bottom:40px; text-align:center" >
               <el-button type="primary" @click="submitFormQuick">提交</el-button>
               <el-button type="success" @click="handleDataInfo">修改</el-button>
               <el-button type="warning" @click="Delete">删除</el-button>
            </div>   
          </el-card>  
        </el-main>
        <!-- 项目信息详情及修改 -->
        <el-dialog :visible.sync="dialogVisable" title="信息修改" class="dialog2" @close="DeleteData">
          <!-- logo提交 -->
          <span style="float:left;margin:auto 15px auto 30px">游戏图标</span>
          <el-upload 
            ref="upload2"
            :action="url2"
            :with-credentials="true"
            :on-success="upFile"
            :on-remove="handleRemove"
            :data="upData"
            :auto-upload="false"
            :file-list="fileList"
            accept=".png">
              <el-button size="small" type="primary" style="float:left"> 点击上传</el-button>
            </el-upload>
            <el-form :model="setGameData" label-width="100px">
              <el-form-item label="游戏名称">
                <el-input  v-model="setGameData.GameName" ></el-input>
              </el-form-item>
               <span style="float:left;margin:auto 15px auto 30px">选择平台</span>
               <el-select v-model="setGameData.Platform" placeholder="选择平台" style="margin-left:0px">
                  <el-option v-for="item in optionAgent" :key="item" :label="item" :value="item"> </el-option>
              </el-select>
              <el-form-item label="版本" >
                <el-input  v-model="setGameData.Version" ></el-input>
              </el-form-item>
              <el-form-item label="游戏引擎">
                <el-input v-model="setGameData.Engine"></el-input>
              </el-form-item>
              <el-form-item label="游戏类型">
                <el-input v-model="setGameData.GameType"></el-input>
              </el-form-item>
              <el-form-item label="发行公司">
                <el-input v-model="setGameData.Company"></el-input>
              </el-form-item>
              <el-form-item label="测试日期">
                <el-date-picker v-model="setGameData.TestDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  placeholder="选择日期">
                </el-date-picker>
                <!-- <el-input v-model="setGameData.TestDate"></el-input> -->
              </el-form-item>
              <el-form-item label="测试时长">
                <el-input v-model="setGameData.TestTime"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm">提交(带logo)</el-button>     
                <el-button type="primary" @click="submitForm1">提交</el-button>          
                <el-button @click="Cancle">取消</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
      </el-container>    
    </div>
  </div>
</template>
<script>
export default {
  data(){
return {
        //上传android或ios
        uploadAgent:'',
        optionAgent:['Android','ios'
        ],
        fileList:[],
        // 上传文件地址
        url:this.$http.defaults.baseURL,
        url2:this.$http.defaults.baseURL+"/confirm_devices/",
        // 提交筛选信息
        // 服务端获取项目列表
        optionData:[],

        // 修改项目信息
        setGameData:{
        },
        // 多选框 
        tableData: [],       
        Selectionid:[], // 选中数据
        Selectiongameid:[],
        Selectionversionid:[],
        dialogVisable:false,
        dialogVisable1:false,
      }

  },
  created(){
    this.getRecentProject();
  },
  computed:{
    upData() {
      return{
        body:JSON.stringify(this.setGameData)
      }
    },
  },
  methods:{
    testbutton(){
    
    },
    // 初始请求最近项目
    async getRecentProject(){
      const {data:res} = await this.$http.get("init_manage_list");
      console.log(res)
      this.tableData = res.data.list
      if(res.meta.status !==200){
        this.$message.error(res.meta.msg)
      }
    },

    //修改事件
    handleDataInfo(){
      if(this.Selectionid.length){
        this.setGameData.id = this.Selectionid;
        this.setGameData.GameId = this.Selectiongameid;
        this.setGameData.VersionId = this.Selectionversionid;
        this.dialogVisable = true
        console.log(this.setGameData)
      }else{
        this.$message.info("请先选择项目")
      }
    },
    // 直接提交
    submitFormQuick(){
        if(this.Selectionid.length){
        this.$confirm("请确认是否直接提交数据",'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
          }).then( async () => {
              var id = JSON.stringify({id:this.Selectionid})
              const {data:res} = await this.$http.get("confirm_devices_quick",{
              params:id
              });
              if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg);
              }
              this.getRecentProject();
              this.$message.success(res.meta.msg); 
          }).catch(() => {
              return this.$message({
                type: 'error',
                message: "操作失败"
          });
       });  
      }else{
        return this.$message.error("请先选择需要提交的数据")
      }
    },
    //删除事件 
    Delete(){
      if(this.Selectionid.length){
        this.$confirm("请确认是否删除",'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
          }).then( async () => {
              var id = JSON.stringify({id:this.Selectionid})
              const {data:res} = await this.$http.get("device_delete",{
              params:id
              });
              if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg);
              }
              this.getRecentProject();
              this.$message.success(res.meta.msg); 
          }).catch(() => {
              return this.$message({
                type: 'error',
                message: "操作失败"
          });
       });  
      }else{
        return this.$message.error("请先选择需要删除的数据")
      }
      
    },
    // 获取单个版本报告
    // getReport(val){     
    //   console.log(val)
    // },
    // 选中多个项目，获取id值
    getServalReport(val){
      console.log(val)
      this.Selectionid=[]
      this.Selectiongameid=[]
      this.Selectionversionid = []
      for(var i =0;i<val.length;i++){
        this.Selectionid[i] = val[i].id;
        this.Selectiongameid[i] = val[i].GameId;
        this.Selectionversionid[i] = val[i].VersionId;
      }
      console.log(this.Selectionid)
    },
    // 修改单个版本游戏信息
    Report(val){
      this.setGameData = val
      this.setGameData.id= val.id
      this.setGameData.GameId=val.GameId
      this.setGameData.VersionId=val.VersionId
      this.dialogVisable=true
    },
    
    // 选择平台并生成url
    selectUrl(){
      this.url = this.url+'/upload_file_'+this.uploadAgent+'/'
    },
     // 上传数据
    submitUpload(){
      this.$refs.upload.submit();
    },
    // 上传修改表单
    submitForm(){
      // console.log(this.fileList)
      // this.$http.post("confirm_devices/",this.setGameData);//不传图片，只传表格
      this.$refs.upload2.submit();
        
    },
    //不传图片，只传表格
    async submitForm1(){
      const {data:res} = await this.$http.post("confirm_devices/",this.setGameData);
      if(res.meta.status !==200){
        this.$message.error(res.meta.msg)
      }
      this.dialogVisable = false
      this.getRecentProject();
      return this.$message.success(res.meta.msg);
    },
    // 取消{修改
    Cancle(){
      this.dialogVisable=false
      this.getRecentProject();
    },
    // 关闭dialog时清除数据
    DeleteData(){
      this.setGameData={
        },
      this.url=this.$http.defaults.baseURL,
      this.uploadAgent=''
    },
    //表单随文件一起上传
    // add(form) {
    //   this.$refs[form].validate(async valid => {
    //     if (valid) {
    //     // 表单验证通过后使用组件自带的方法触发上传事件
    //       this.$refs.upload.submit()
    //     } else {
    //       return false;
    //     }
    //   }); 
    // },
    // 成功上传文件
    upFile(res) {
      console.log(res)
      if (res.meta.status == 200) {
        // 文件上传成功后的回调，比如一些提示信息或者页面跳转都写在这里
        this.dialogVisable1 = false
        this.dialogVisable = false
        this.getRecentProject();
        return this.$message.success(res.meta.msg);
      } else {
        this.$message.warning(res.meta.msg);
        let _this = this;
        setTimeout(function() {
          _this.$refs.upload.clearFiles();
        }, 1000);
      }
    },
    //  移除文件
    handleRemove(file, fileList) {
      console.log(file,fileList)
      this.$message.warning('已移除文件，请重新上传！');
    },
  }
}
</script>

<style>
  .el-upload-dragger{
    height: 135px;
  }
  .el-header, .el-footer {
    background-color: rgb(23, 24, 22);
    color: rgb(255, 255, 254);
    text-align: center;
    line-height: 60px;
    width: 100%;
  }
  .el-main {
    background-color:snow;
    width: 100%;
  }
  .el-card{
    margin: 0px;
    padding: 0px;
    width: 100%;
    height: 100%;
  }
  .el-select{
    margin:5px 5px 10px 10px;
  }
  .project{
    display: flex;
    align-items: center;
  }
  .dialog{
    height: auto;
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position: absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-80%);
    animation:none !important
    /* max-height: calc(100% -5000px);
    max-width: calc(100% -30px); */
  }
  .dialog2{
   width: center;
   
  }


</style>
