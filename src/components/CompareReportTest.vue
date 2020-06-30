<template>
  <div >
      <span>
        <input class="input-file" type="file" @change="exportData" accept=".xls" />
      </span>
      <el-main >
        <div id="selectBar" class="selectbar" >
          <div style="margin-bottom:-10px;height:auto;" :class="selectBarFixed==true ? 'isFixed':''">
            <div style="display:flex">
              <el-card class="head" v-for="(item,index) in testData" :key="index" style="margin-bottom:-10px;margin-right:5px">
                <!-- 游戏logo -->
                <div>
                  <img  style="height:90px;width:90px;margin-right:20px;float:left" :src="(imgUrl+item.ImgPath)" />
                </div>
                <!-- 游戏详情 -->
                <div style="margin-left:30px;color:black;font-size:14px;">
                  <span style="color:#0101DF;font-size:18px;font-weight:700">{{item.ProjectName}}</span>
                  <div></div>
                  版本：<span style="font-weight:700 ">{{item.TestVersion}}</span>
                  <div></div>
                  发行商：<span style="font-weight:700 ">{{item.ProjectDeveloper}}</span>
                  <div></div>
                  游戏引擎：<span style="font-weight:700 ">{{item.ProjectEngine}}</span>
                </div>
              </el-card>
              <!-- <el-card class="head">
              </el-card> -->
            </div>      
            <el-divider></el-divider>
            <el-card  style="margin-top:-10px;padding:0">
                <el-tabs @tab-click="handleClick" style="width:100%;margin:0;padding:0">
                  <el-tab-pane label="概览"></el-tab-pane>
                  <el-tab-pane label="Fps"></el-tab-pane>
                  <el-tab-pane label="Cpu"></el-tab-pane>
                  <el-tab-pane label="Memory"></el-tab-pane>
                  <el-tab-pane label="流量"></el-tab-pane>
                  <el-tab-pane label="电量"></el-tab-pane>
                  <el-tab-pane label="温度"></el-tab-pane>
                </el-tabs>
            </el-card>  
          </div>
        </div>
        <el-card style="margin-top:20px"> 
        <!-- 数据内容 -->
          <div>
          <!-- 1.概览 -->
            <el-card  style="margin-bottom:30px" id="Summary">
              <div>概览(Avg)</div>
               <el-table :data="testData" style="width: 100%">
                <el-table-column prop="ProjectName" label="项目"  width="100"></el-table-column>
                <el-table-column prop="TestVersion" label="版本"  width="100"></el-table-column>
                <el-table-column  prop="TestDate" label="测试日期" width="150"></el-table-column>
                <el-table-column prop="TestTime" label="测试时长"  width="300"></el-table-column>
                <el-table-column  prop="AvgFps" label="Fps" > </el-table-column>
                <el-table-column prop="AvgCpu" label="Cpu[%]" > </el-table-column>
                <el-table-column prop="AvgMemory" label="Memory[MB]" ></el-table-column>  
                <el-table-column prop="AvgNet" label="流量[kb]" ></el-table-column>                
                <el-table-column prop="AvgEle" label="耗电量[mAh]" ></el-table-column>    
                <el-table-column prop="AvgTem" label="温度[℃]"></el-table-column> 
               </el-table> 
            </el-card>
          <!-- 2.Fps -->
            <el-card  style="margin-bottom:30px" id="Fps" >
              <div >
                  <span style="font-weight:700;font-size:25px;margin-right:30px;color:#49221a">FPS数据</span>
                  <el-button round size="mini" style="color:grey">高端机型</el-button>
                  <el-button round size="mini" style="color:grey">中端机型</el-button>
                  <el-button round size="mini" style="color:grey">低端机型</el-button>
                  <el-button round size="mini" style="color:grey">全部机型</el-button>
              </div>
              <!-- 柱状 -->
              <div id="Fps_over" style="height:450px;width:auto">
              </div>
              <!-- 最高Fps、最低FPS设备 -->
           
            </el-card>
          <!-- 3.Cpu -->
            <el-card  style="margin-bottom:30px;" >
              <div style="height:450px;width:auto" id="Cpu">
              </div>
              
            </el-card>
          <!-- 4.Memory -->
            <el-card  style="margin-bottom:30px;" >
                <div style="height:450px;width:auto" id="Memery">
              </div>
              
            </el-card>
          <!-- 5.流量 -->
            <el-card  style="margin-bottom:30px;" >
                <div style="height:450px;width:auto" id="Net">
              </div>
              
            </el-card>
          <!-- 6.电量 -->
            <el-card  style="margin-bottom:30px;" >
                <div style="height:450px;width:auto" id="Ele">
              </div>
              
            </el-card> 
          <!-- 7.温度 -->
            <el-card  style="margin-bottom:30px;">
                <div style="height:450px;width:auto" id="Tem">
              </div>
              
            </el-card>
        </div>  
        </el-card>
      </el-main> 
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  data(){
    return{
      imgUrl:'http://10.0.10.246:80/icon/',
      //接受版本id
      idList:[] ,
      BrokenLine:null,
      selectBarFixed : false,    
      color1:['#ff7f50','#87cefa','#da70d6','#6699FF','#ff6666','#3cb371'],
      color2:['#32cd32','#6495ed','#ff69b4','#7b68ee','#00fa9a','#ffd700'],
      color3:['#ba55d3','#cd5c5c','#ffa500','#da70d6','#6699FF','#ff6666'],
      color4:['#40e0d0','#1e90ff','#ff6347','#6495ed','#ff69b4','#7b68ee'],
      color5:['#7b68ee','#00fa9a','#ffd700','#ffa500','#da70d6','#6699FF'],
      color6:['#6699FF','#ff6666','#3cb371','#ff7f50','#87cefa','#da70d6'],
      deviceslist:[],
      dataVarible:[],
      testData:[],
      testX:[],
      testY:[]
    }
  },
  created() { 
    // 接受传送过来的参数
      this.idList = this.$route.query.idList;
      this.getData(this.idList) 
  },
  mounted(){
    // 使用
    // setTimeout(()=>{
    //   let Fps="Fps";
    //   let Cpu="Cpu";
    //   let Memery="Memery";
    //   let Net = "Net";
    //   let Ele ="Ele";
    //   let Tem = "Tem"
    //   this.DoEchart(Fps);
    //   this.DoEchart(Cpu);
    //   this.DoEchart(Memery);
    //   this.DoEchart(Net);
    //   this.DoEchart(Ele);
    //   this.DoEchart(Tem);
    // },1000)
    window.addEventListener('scroll',this.handleScroll);
  },
  destroyed(){
    window.removeEventListener('scroll',this.handleScroll)
  },
  methods:{
    // 导入excel文件，测试用
    bthClick(){
      document.querySelector('.input-file').click()
    },
    exportData(){
      if(!event.currentTarget.files.length){
        return
      }
      const that = this
      // 获取文件对象
      var f = event.currentTarget.files[0]
      var reader = new FileReader()
       // 重写FileReader上的readAsBinaryString方法
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = ''
        var wb // 读取完成的数据
        var outdata // 你需要的数据
        var reader = new FileReader()
        reader.onload = function () {
          // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // 接下来就是xlsx了，具体可看api
          wb = XLSX.read(binary, {
            type: 'binary'
          })
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          // 自定义方法向父组件传递数据
          // console.log('outdata = ' + JSON.stringify(outdata))
          that.$emit('getResult', outdata)
          // 处理读取的数据
          for(let i=0;i<outdata.length;i++){
            let a =outdata[i].time
            let min = parseInt(a/(1000*60))
            if(min<10){
              min = '0'+min
            }
            let second=parseInt((a%(1000*60))/1000)
            if(second<10){
              second = '0'+second
            }
            let x = min+":"+second
            let b =outdata[i].FPS
            that.testX.push(x)
            that.testY.push(b)
          }
        }
        reader.readAsArrayBuffer(f)
      }
      reader.readAsBinaryString(f)
      setTimeout(()=>{
        let Fps="Fps";
        let Cpu="Cpu";
        let Memery="Memery";
        let Net = "Net";
        let Ele ="Ele";
        let Tem = "Tem"
        that.DoEchart(Fps);
        that.DoEchart(Cpu);
        that.DoEchart(Memery);
        that.DoEchart(Net);
        that.DoEchart(Ele);
        that.DoEchart(Tem);
      },300)
    },


    // 获取数据信息
    async getData(List){
      var idList=[{
              id:List
            }]
      const {data:res} = await this.$http.get("compare_by_version",{
        params:idList})
      // console.log(res)
      if(res.meta.status!==200){
        return this.$message.error(res.meta.msg)
      }
      this.testData = res.data.version_list
     
      this.DataOption();
      for(let i=0;i<this.testData.length;i++){
        var data = 'data'
        var dataVarible1={}
        dataVarible1[data]=[]
        dataVarible1[data].length= this.deviceslist.length
        this.dataVarible[i] = dataVarible1
      }    
    },


    // 设置锚点
    handleClick(tab) {
      // console.log(tab.paneName);
      var n =parseInt(tab.paneName);
      var divId;
      switch(n){
        case 0: divId = "Summary";
        break;
        case 1: divId = "Fps";
        break;
        case 2: divId = "Cpu";
        break;
        case 3: divId = "Memery";
        break;
        case 4: divId = "Net";
        break;
        case 5: divId = "Ele";
        break;
        case 6: divId = "Tem";
        break;   
      }
      var element = document.getElementById(divId);
      element.scrollIntoView(false);
    },
    // 数据对比去重，x轴数据处理
    DataOption(){
      let a = this.testData.length;
      if(a==1){
        this.deviceslist=this.testData[0].DevicesList
      }else{
        let list=[]
        for(let i=0;i<a;i++){
          list = list.concat(this.testData[i].DevicesList)
        }
        for(let i=0;i<list.length;i++){
          if(this.deviceslist.indexOf(list[i])==-1) this.deviceslist.push(list[i])
        }
      }
      console.log(this.deviceslist)
    },
    //Y轴数据处理 
    DataOption2(xndata){  
      let n = this.testData.length; 
      if(n==1){
        this.dataVarible[0].data=xndata[0]//只有一组数据时，直接赋值
      }else{
        for(let m=0;m<this.testData.length;m++){
          let list = this.testData[m].DevicesList
          for(let i=0;i<this.deviceslist.length;i++){
            var a = list.indexOf(this.deviceslist[i])
            if(a!=-1 ){
              this.dataVarible[m].data[i]=xndata[m][a]
              }else{
              this.dataVarible[m].data[i]=null
             }        
           }
        }     
      }
      // return this.dataVarible;
    },

    DoEchart(type) {
      console.log(this.testData)
      this.$nextTick(()=>{
        // var data={
        //   name：[],
        //   data1:[],
        //   data2:[],
        // }
          // var DataModel={
          //     name: null,
          //     type: 'line',
          //     data: null,
          //     markPoint: {
          //         data: [
          //             {type: 'max', name: '最大值'},
          //             {type: 'min', name: '最小值'}
          //         ]
          //     },
          //     markLine: {
          //         data: [
          //             {type: 'average', name: '平均值'}
          //         ]
          //     } 
          //   }
          // let setData=[]
          // var setName=[]
          // let xnData=[]   
          // // setData.length=this.testData.length
          // for(let i=0;i<this.testData.length;i++){
          //   setData[i]= Object.assign({},DataModel) //只传值，不传对象
          //   // setData[i].data=this.dataVarible[i].data
          //   setData[i].name=this.testData[i].ProjectName+"v_"+this.testData[i].TestVersion
          //   setName.push(setData[i].name)
          // }
          var SetColor=[]         
          if(type == "Fps"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Fps_over'))
            SetColor = this.color1  
          //   for(let i=0;i<this.testData.length;i++){  
          //     xnData.push(this.testData[i].allFps)      
          //   }
          //   this.DataOption2(xnData);
          //   for(let i=0;i<this.testData.length;i++){  
          //     setData[i].data=this.dataVarible[i].data
          // }  

          }else if(type=="Cpu"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Cpu'))
            SetColor = this.color2
          //   for(let i=0;i<this.testData.length;i++){  
          //     xnData.push(this.testData[i].allCpu)      
          //   }
          //   this.DataOption2(xnData);
          //   for(let i=0;i<this.testData.length;i++){  
          //     setData[i].data=this.dataVarible[i].data
          // }  

          }else if(type=="Memery"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Memery'))
            SetColor = this.color3
          //   for(let i=0;i<this.testData.length;i++){  
          //     xnData.push(this.testData[i].allMemory)      
          //   }
          //   this.DataOption2(xnData);
          //   for(let i=0;i<this.testData.length;i++){  
          //     setData[i].data=this.dataVarible[i].data
          // }    

          }else if(type=="Net"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Net'))
            type = "流量"
            SetColor = this.color4
          //   for(let i=0;i<this.testData.length;i++){  
          //     xnData.push(this.testData[i].allNet)      
          //   }
          //   this.DataOption2(xnData);
          //   for(let i=0;i<this.testData.length;i++){  
          //     setData[i].data=this.dataVarible[i].data
          // }          

          }else if(type=="Ele"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Ele'))
            type = "电量"
            SetColor = this.color5
          //   for(let i=0;i<this.testData.length;i++){  
          //     xnData.push(this.testData[i].allEle)      
          //   }
          //   this.DataOption2(xnData);
          //   for(let i=0;i<this.testData.length;i++){  
          //     setData[i].data=this.dataVarible[i].data
          // }             
          }else if(type=="Tem"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Tem'))
            type = "温度"
            SetColor = this.color6
          //   for(let i=0;i<this.testData.length;i++){  
          //     xnData.push(this.testData[i].allTem)      
          //   }
          //   this.DataOption2(xnData);
          //   for(let i=0;i<this.testData.length;i++){  
          //     setData[i].data=this.dataVarible[i].data
          // }             
          }
          // 绘制图表
          let option = {
          color:SetColor,
          title: {
            text:'高端机型对比',
            textStyle: {
              fontSize:15,
              color:'#409EFF'
            },
          },
          dataZoom:[{
            type:'slider',
            height:'28',
            show:true,
            xAxisIndex:[0],
            left:'10%',
            bottom:-5,
            start:0,
            end:50,
          }],
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data:["FPS"],
          },
          bar:{
            barGap:'10%',
            barCategoryGap:'5%'
          },
          toolbox: {
              show: true,
              feature: {
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
              }
          },
          calculable: true,
          xAxis: [
              {
                  type: 'category',
                  axisLabel:{interval:60},
                  // data:this.deviceslist
                  data:this.testX
              }
          ],
          yAxis: [
              {
                  type: 'value'
              }
          ],
          series:{
              name: "FPS",
              type: 'line',
              data: this.testY,
              markPoint: {
                  data: [
                      {type: 'max', name: '最大值'},
                      {type: 'min', name: '最小值'}
                  ]
              },
              markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
              } 
          }
        };
        this.BrokenLine.setOption(option)
      })
    },

    // 元素吸顶
    handleScroll(){
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop ||document.body.scrollTop;
      // console.log(scrollTop)
      var offsetTop = document.querySelector("#selectBar").offsetTop
      // console.log(offsetTop)
      if(scrollTop >offsetTop){
        this.selectBarFixed = true;
      }else{
        this.selectBarFixed = false;
      }
    },
    
  }
} 
</script>


<style >

.isFixed{
  position: fixed;
  top:0px;
  z-index: 1;
  width: 97%;
  background:snow
}
.head{
  height: 120px;
  width: 400px;
  margin: 0px;
  margin-right: 30px;
}
</style>