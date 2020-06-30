<template>
  <div id="app">
    <div id="nav">
      <el-container >
        <el-header style="align-items:center;background-color:#333333;margin-top:-10px;margin-left:-10px;width:110%">
          <div style="dispaly:flex;align-items:center;justify-content:space-between;">
            <img class="imgHeader" src="../assets/image/testcenter.png" alt />
            <el-button type="text" style="float:left;font-size:18px;margin-top:10px;margin-left:-10px" disabled>测试数据平台</el-button>
             <el-button type="text" style="float:left;font-size:18px;margin-top:10px" @click="Borrow">设备借用平台</el-button>
            <el-button type="info" style="float:right;margin-top:10px;margin-right:8%" @click="logout">退出</el-button>
          </div>
          <!-- <el-button type="primary" style="float:right;margin-top:10px" @click="TurnUpload">上传数据</el-button> -->
        </el-header>
        <el-main>
          <el-card>
            <!-- 筛选栏 -->
            <div class="summary">
              <span >自研项目</span>
              <el-select v-model="setSelectInfo.selfProject" multiple clearable placeholder="选择项目" @change="selectProject1">
                <el-option
                  v-for="(item,index) in options1" :key="index" :label="item.game_name" :value="item.game_name"> </el-option>
              </el-select>-
              <el-select v-model="setSelectInfo.selfVersionId" clearable placeholder="选择版本" @change="selectVersion1">
                <el-option
                  v-for="(item,index) in optionsVersion1" :key="index" :label="item.version" :value="item.id"> </el-option>
              </el-select>
              <span style="margin-left:100px">竞品项目</span>
              <el-select v-model="setSelectInfo.comProject" multiple clearable placeholder="选择项目" @change="selectProject2">
                <el-option v-for="(item,index) in options2" :key="index" :label="item.game_name" :value="item.game_name"></el-option>
              </el-select>-
              <el-select v-model="setSelectInfo.comVersionId" clearable placeholder="选择版本" @change="selectVersion2">
                <el-option v-for="(item,index) in optionsVersion2" :key="index" :label="item.version" :value="item.id"></el-option>
              </el-select>
              <!-- <span >设备</span>
              <el-select v-model="value" filterable placeholder="选择设备">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>   -->
              <!-- <el-button type="primary" style="margin-left:30px">筛选</el-button>        -->
              <el-button type="warning" style="margin-left:30px" @click="reset">重置</el-button>    
                       
            </div>
            <el-divider></el-divider>
            <!-- 版本数据 -->
            <template>
              <el-table ref="reportTable" :data="tableData" style="width: 100%;cursor:pointer" highlight-current-row @row-click="getReport"   @selection-change="getServalReport">>
                <!-- <el-table-column type="index" label="序号"></el-table-column> -->
                <el-table-column type="selection"></el-table-column>
                <el-table-column  label="项目" width="auto"> 
                  <div slot-scope="scope" class="project">
                    <!-- {{scope.row}} -->
                    <div  style="display:contents">
                      <img  style="width:52px;height:52px" :src="(imgUrl+scope.row.ImgPath)" />
                      <span style="margin-left:10px ;font-weight:bold;color:blue" @click="Report(scope.row)">{{scope.row.ProjectName}}</span>
                    </div>
                  </div>
                </el-table-column>
                <el-table-column prop="TestVersion" label="版本"  width="auto"></el-table-column>
                <el-table-column  prop="TestDate" label="测试日期" width="auto"></el-table-column>
                <el-table-column  prop="TestTime" label="测试时长(min)" width="auto"></el-table-column>
                <!-- <el-table-column  prop="FPS_avg" label="Fps" > </el-table-column>
                <el-table-column prop="CPU_avg" label="Cpu[%]" > </el-table-column>
                <el-table-column prop="Memory_avg" label="Memory[MB]" ></el-table-column>  
                <el-table-column prop="Net_avg" label="流量[kb]" ></el-table-column>                
                <el-table-column prop="Ele_avg" label="耗电量[mAh]" ></el-table-column>    
                <el-table-column prop="Tem_avg" label="温度[℃]"></el-table-column>                                           -->
              </el-table>
              <!-- 页码 -->
              <!-- <div>
                <el-pagination layout="prev,pager,next" :total="10"
                :page-size="2"
                ></el-pagination>
              </div> -->
            </template>
            <div style="margin-top:50px; text-align:center" >
               <el-button @click="Compare" type="success" >进行对比</el-button>
               <!-- <el-button @click="toggleSelection" type="warning">取消选中</el-button> -->
            </div>   
          </el-card>  
        </el-main>
      </el-container>    
    </div>
  </div>
</template>
<script>
export default {
  data(){
return {  
        // 提交筛选信息
        setSelectInfo: {
          selfProject: [],
          selfVersionId:'',
          comProject:[],
          comVersionId:'',
        },
        // 图片地址
      
        //自研项目列表 
        options1: [],
        // 竞品项目列表
        options2: [],
        // 自研项目版本
        optionsVersion1:[],
        // 竞品项目版本
        optionsVersion2:[],
        // 服务端获取项目列表
        optionData:[],
        // 选中数据
        // 修改项目信息
        setGameData:{},
        // 测试数据
        tableData: [],
        Selection:[],
        dialogVisable:false,
        dialogVisable1:false,
        imgUrl:'http://10.0.10.246:80/icon/'
      }

  },
  created(){
    this.getProjectList();
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
    Borrow(){
        var url = "http://10.0.10.246:8090/home"
        window.open(url)
    },
    logout() {
			// 清除token值
			window.sessionStorage.clear();
			// 重定向到登录页
			this.$router.push("/login");
		},
     //重置筛选数据
    reset(){
      this.setSelectInfo = {
          selfProject: [],
          selfVersionId:'',
          comProject:[],
          comVersionId:'',
        }
        this.getRecentProject();
    },
    TurnUpload(){
      this.$router.push('/upload')
    },
    // 请求初始化信息
    async getProjectList(){
      const {data:res} = await this.$http.get("init_select_list");
      // console.log(res)
      this.options1= res.data.dict.slef_list;
      this.options2= res.data.dict.other_list;
      if(res.meta.status !==200){
        this.$message.error(res.meta.msg)
      }
    },
    // 初始请求最近项目
    async getRecentProject(){
      const {data:res} = await this.$http.get("init_list");
      // console.log(res)
      this.tableData = res.data.dict.list
      if(res.meta.status !==200){
        this.$message.error(res.meta.msg)
      }
    },

    //传递需要比较的版本ID到比较页面 
    Compare() {
      // this.$router.push('/compare') 
      if(this.Selection.length){
         var {href} = this.$router.resolve({
          path:'/compare',
          query:{
            idList:this.Selection
          }
        });
        window.open(href)
      }else{
        this.$message.info("请先选择测试项目")
      }
     
    },
    // 获取单个版本报告
    getReport(val){     
      let id = val.id
      var {href} = this.$router.resolve({
        path:'/compare',
        query:{
          idList:id
        }
      });
      window.open(href)
    },
    // 选中多个版本
    getServalReport(val){
    // console.log(val)
    this.Selection.length = val.length;
    for(var i =0;i<val.length;i++){
      this.Selection[i] = val[i].id;
    } 
    // console.log(this.Selection)
    },

    // 图片地址
    // ImgPath(){
    //   this.ImgPath =  "..\\assets\\img\\"+"re0Android.png"
    //   return ImgPath
    // },

    // 修改游戏信息
    Report(val){
      this.setGameData = val
      this.dialogVisable=true
    },
    // select的数据绑定-自研项目
    async selectProject1(val){
      // console.log(this.setSelectInfo.selfProject)
      let setSelectInfo=[{
        selfProject: this.setSelectInfo.selfProject,
        selfVersionId: this.setSelectInfo.selfVersionId,
        comProject:this.setSelectInfo.comProject,
        comVersionId:this.setSelectInfo.comVersionId,
      }]
      if(this.setSelectInfo.selfProject.length>1){
        setSelectInfo[0].selfVersionId=''
      }
      this.optionsVersion1=[]
      this.setSelectInfo.selfVersionId=""
      for(let i=0;i<this.options1.length;i++){
        if(val.length==1 && val[0]==this.options1[i].game_name){
          this.optionsVersion1 = this.options1[i].version_list
          break;
        }
      }
      const {data:res} = await this.$http.get("get_select_list",{params:setSelectInfo});
      if(res.meta.status !==200){
        this.$message.error(res.meta.msg)
      }
      this.tableData = res.data.dict.list
    },
    // select的数据绑定-竞品项目
    async selectProject2(val){
      let setSelectInfo=[{
        selfProject: this.setSelectInfo.selfProject,
        selfVersionId: this.setSelectInfo.selfVersionId,
        comProject:this.setSelectInfo.comProject,
        comVersionId:this.setSelectInfo.comVersionId,
      }]
      if(this.setSelectInfo.comProject.length>1){
        setSelectInfo[0].comVersionId=''
      }
      this.optionsVersion2=[]
      this.setSelectInfo.comVersionId=""
      for(let i=0;i<this.options2.length;i++){
        if(val.length==1 && val[0]==this.options2[i].game_name){
          this.optionsVersion2 = this.options2[i].version_list
          break;
        }
       }
      const {data:res} = await this.$http.get("get_select_list",{params:setSelectInfo});
      if(res.meta.status !==200){
        this.$message.error(res.meta.msg)
      }
      this.tableData = res.data.dict.list
    },
    // 自研项目版本id绑定
    async selectVersion1(){
      let setSelectInfo=[{
        selfProject: this.setSelectInfo.selfProject,
        selfVersionId: this.setSelectInfo.selfVersionId,
        comProject:this.setSelectInfo.comProject,
        comVersionId:this.setSelectInfo.comVersionId,
      }]
      const {data:res} = await this.$http.get("get_select_list",{params:setSelectInfo});
      if(res.meta.status !==200){
        this.$message.error(res.meta.msg)
      }
      this.tableData = res.data.dict.list
    },
    // 竞品项目版本id绑定
    async selectVersion2(){
      let setSelectInfo=[{
        selfProject: this.setSelectInfo.selfProject,
        selfVersionId: this.setSelectInfo.selfVersionId,
        comProject:this.setSelectInfo.comProject,
        comVersionId:this.setSelectInfo.comVersionId,
      }]
      const {data:res} = await this.$http.get("get_select_list",{params:setSelectInfo});
      if(res.meta.status !==200){
        this.$message.error(res.meta.msg)
      }
      this.tableData = res.data.dict.list
    },
  }
}
</script>

<style>
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
  .imgHeader {
			width: 170px;
			margin-left: -18px;
			margin-top: 0px;
      float: left;
	}
</style>
