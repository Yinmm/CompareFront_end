<template>
  <div >
      <!-- <span>
        <input class="input-file" type="file" @change="exportData" accept=".xls" />

      </span> -->
      <el-main >
        <div id="selectBar" class="selectbar" >
          <div style="margin-bottom:-10px;height:auto;" :class="selectBarFixed==true ? 'isFixed':''">
            <div style="display:flex">
              <el-card class="head" v-for="(item,index) in alldata" :key="index" style="margin-bottom:-10px;margin-right:5px;height:130px;">
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
        <el-card v-if="alldata.length>0" style="margin-top:20px"> 
        <!-- 数据内容 -->
          <div>
          <!-- 1.概览 -->
            <el-card  style="margin-bottom:30px;" id="Summary">
              <div>概览</div>
              <el-button class="el-icon-edit" @click="dialogVisable=true" round type="info" size='mini' style="float:right;margin-top:-30px;margin-bottom:10px">自定义标准</el-button>
               <el-table :data="alldata" style="width: 100%;z-index:0" >
                <el-table-column  fixed="left" prop="ProjectName" label="项目"  width="150" align="center"></el-table-column>
                <el-table-column  fixed="left" prop="TestVersion" label="版本"  width="150"  align="center"></el-table-column>
                <el-table-column  fixed="left" prop="TestTime" label="测试时长(min)"  width="150" align="center" ></el-table-column>
                <el-table-column  label="AvgFps"  align="center">
                  <template slot-scope="scope">
                    <span v-if="parseFloat(scope.row.Perform.avg_fps)>Customize.AvgFps" style="color:green;font-weight:bold;" class="el-icon-caret-top">{{scope.row.Perform.avg_fps}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_fps)<Customize.AvgFps" style="color:red;font-weight:bold; font-size:20px" class="el-icon-caret-bottom">{{scope.row.Perform.avg_fps}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_fps)==Customize.AvgFps">{{scope.row.Perform.avg_fps}}</span>
                  </template>
                </el-table-column>
                <el-table-column  label="Fps(超过25)[%]"  width="150"  align="center">
                  <template slot-scope="scope">
                    <span v-if="parseFloat(1-scope.row.Perform.bad_fps_ratio)*100>Customize.Fpsover25" style="color:green;font-weight:bold" class="el-icon-caret-top">{{(1-scope.row.Perform.bad_fps_ratio)*100}}</span>
                    <span v-else-if="parseFloat(1-scope.row.Perform.bad_fps_ratio)*100<Customize.Fpsover25" style="color:red;font-weight:bold ;font-size:20px" class="el-icon-caret-bottom">{{(1-scope.row.Perform.bad_fps_ratio)*100}}</span>
                    <span v-else-if="parseFloat(1-scope.row.Perform.bad_fps_ratio)*100==Customize.Fpsover25">{{(1-scope.row.bad_fps_ratio)*100}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="Perform.avg_cpu" label="AvgCpu[%]" width="150"  align="center">
                  <template slot-scope="scope">
                    <span v-if="parseFloat(scope.row.Perform.avg_cpu)<Customize.AvgCpu" style="color:green;font-weight:bold" class="el-icon-caret-top">{{scope.row.Perform.avg_cpu}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_cpu)>Customize.AvgCpu" style="color:red;font-weight:bold; font-size:20px" class="el-icon-caret-bottom">{{scope.row.Perform.avg_cpu}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_cpu)==Customize.AvgCpu">{{scope.row.Perform.avg_cpu}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="Perform.max_cpu" label="MaxCpu" width="150"  align="center">
                      <template slot-scope="scope">
                    <span v-if="parseFloat(scope.row.Perform.max_cpu)<Customize.MaxCpu" style="color:green;font-weight:bold" class="el-icon-caret-top">{{scope.row.Perform.max_cpu}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.max_cpu)>Customize.MaxCpu" style="color:red;font-weight:bold; font-size:20px" class="el-icon-caret-bottom">{{scope.row.Perform.max_cpu}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.max_cpu)==Customize.MaxCpu">{{scope.row.Perform.max_cpu}}</span>
                  </template>
                 </el-table-column>                
                <el-table-column prop="Perform.avg_memory" label="AvgMemory[MB]" width="150"  align="center">
                    <template slot-scope="scope">
                    <span v-if="parseFloat(scope.row.Perform.avg_memory)<Customize.AvgMemory" style="color:green;font-weight:bold;" class="el-icon-caret-top">{{scope.row.Perform.avg_memory}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_memory)>Customize.AvgMemory" style="color:red;font-weight:bold ;font-size:20px" class="el-icon-caret-bottom">{{scope.row.Perform.avg_memory}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_memory)==Customize.AvgMemory">{{scope.row.Perform.avg_memory}}</span>
                  </template></el-table-column>  
                <el-table-column prop="Perform.max_memory" label="MaxMemory[MB]" width="150"  align="center">
                    <template slot-scope="scope">
                    <span v-if="parseFloat(scope.row.Perform.max_memory)<Customize.MaxMemory" style="color:green;font-weight:bold" class="el-icon-caret-top">{{scope.row.Perform.max_memory}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.max_memory)>Customize.MaxMemory" style="color:red;font-weight:bold ;font-size:20px" class="el-icon-caret-bottom">{{scope.row.Perform.max_memory}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.max_memory)==Customize.MaxMemory">{{scope.row.Perform.max_memory}}</span>
                  </template></el-table-column>                                 
                <el-table-column prop="Perform.avg_data" label="AvgNetwork[kb]" width="150"  align="center">
                    <template slot-scope="scope">
                    <span v-if="parseFloat(scope.row.Perform.avg_data)<Customize.AvgNet" style="color:green;font-weight:bold" class="el-icon-caret-top">{{scope.row.Perform.avg_data}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_data)>Customize.AvgNet" style="color:red;font-weight:bold ;font-size:20px" class="el-icon-caret-bottom">{{scope.row.Perform.avg_data}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_data)==Customize.AvgNet">{{scope.row.Perform.avg_data}}</span>
                  </template></el-table-column>                
                <el-table-column prop="Perform.avg_bat" label="AvgBattery[mAh]" width="150"  align="center">
                    <template slot-scope="scope">
                    <span v-if="parseFloat(scope.row.Perform.avg_bat)<Customize.AvgEle" style="color:green;font-weight:bold" class="el-icon-caret-top">{{scope.row.Perform.avg_bat}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_bat)>Customize.AvgEle" style="color:red;font-weight:bold ;font-size:20px" class="el-icon-caret-bottom">{{scope.row.Perform.avg_bat}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_bat)==Customize.AvgEle">{{scope.row.Perform.avg_bat}}</span>
                  </template></el-table-column>    
                <el-table-column prop="Perform.avg_temp" label="AvgTemp[℃]"  align="center"  width="150">
                    <template slot-scope="scope">
                    <span v-if="parseFloat(scope.row.Perform.avg_temp)<Customize.AvgTem" style="color:green;font-weight:bold" class="el-icon-caret-top">{{scope.row.Perform.avg_temp}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_temp)>Customize.AvgTem" style="color:red;font-weight:bold ;font-size:20px" class="el-icon-caret-bottom">{{scope.row.Perform.avg_temp}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.avg_temp)==Customize.AvgTem">{{scope.row.Perform.avg_temp}}</span>
                  </template></el-table-column> 
                <el-table-column prop="Perform.max_temp" label="MaxTemp[℃]"  align="center"  width="150">
                    <template slot-scope="scope">
                    <span v-if="parseFloat(scope.row.Perform.max_temp)<Customize.MaxTemp" style="color:green;font-weight:bold" class="el-icon-caret-top">{{scope.row.Perform.max_temp}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.max_temp)>Customize.MaxTemp" style="color:red;font-weight:bold ;font-size:20px" class="el-icon-caret-bottom">{{scope.row.Perform.max_temp}}</span>
                    <span v-else-if="parseFloat(scope.row.Perform.max_temp)==Customize.MaxTemp">{{scope.row.Perform.max_temp}}</span>
                  </template></el-table-column>                 
               </el-table> 
            </el-card>
          <!-- 2.Fps -->
            <el-card style="margin-bottom:30px" >
               <div style="margin-bottom:10px">
                  <span style="font-weight:700;font-size:25px;margin-right:30px;color:#49221a">FPS数据</span>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(1)">高端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(2)">中端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(3)">低端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(4)">全部机型</el-button>
                  <el-select v-model="selectDevices" @change="selectDevice" filterable  no-match-text="没有找到该机型数据" popper-class="select-option" style="width:250px;margin-left:20px;" size="mini" clearable placeholder="自定义机型">
                    <el-option v-for="(item,index) in alldevices" :key="index" :label="item.name" :value="item.number">
                    </el-option>
                  </el-select>
              </div>
                <!-- 最高。最低、平均 -->
              <div v-if="testData[0].device" class="max_min_avg">
                  <div class="max_min_avg_detail">最大值
                    <div v-for="(item,index) in data_model1" :key="index" :style="{color:color1[index]}">{{item.ProjectName}}:{{item.max}}
                    <!-- <span style="color:red">{{item.max}} </span> -->
                    </div>
                  </div>
                  <div class="max_min_avg_detail">最小值
                    <div v-for="(item,index) in data_model1" :key="index" :style="{color:color1[index]}">{{item.ProjectName}}:{{item.min}} </div>
                  </div>
                  <div class="max_min_avg_detail">平均值
                    <div v-for="(item,index) in data_model1" :key="index" :style="{color:color1[index]}">{{item.ProjectName}}:{{item.avg}} </div>
                  </div>
              </div>
              <div id="Fps_over" style="height:450px;width:auto">
              </div>
            </el-card>
          <!-- 3.Cpu -->
            <el-card  style="margin-bottom:30px;" >
              <div style="margin-bottom:10px">
                  <span style="font-weight:700;font-size:25px;margin-right:30px;color:#49221a">Cpu数据</span>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(1)">高端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(2)">中端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(3)">低端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(4)">全部机型</el-button>
                  <el-select v-model="selectDevices" @change="selectDevice" filterable  no-match-text="没有找到该机型数据" popper-class="select-option" style="width:250px;margin-left:20px;" size="mini" clearable placeholder="自定义机型">
                    <el-option v-for="(item,index) in alldevices" :key="index" :label="item.name" :value="item.number">
                    </el-option>
                  </el-select>                 
              </div>
              <div v-if="testData[0].device" class="max_min_avg">
                  <div class="max_min_avg_detail">最大值
                    <div v-for="(item,index) in data_model2" :key="index" :style="{color:color2[index]}">{{item.ProjectName}}:{{item.max}}
                    <!-- <span style="color:red">{{item.max}} </span> -->
                    </div>
                  </div>
                  <div class="max_min_avg_detail">最小值
                    <div v-for="(item,index) in data_model2" :key="index" :style="{color:color2[index]}">{{item.ProjectName}}:{{item.min}} </div>
                  </div>
                  <div class="max_min_avg_detail">平均值
                    <div v-for="(item,index) in data_model2" :key="index" :style="{color:color2[index]}">{{item.ProjectName}}:{{item.avg}} </div>
                  </div>
              </div>
              <div style="height:450px;width:auto" id="Cpu">
              </div>
              
            </el-card>
          <!-- 4.Memory -->
            <el-card  style="margin-bottom:30px;" >
              <div style="margin-bottom:10px">
                  <span style="font-weight:700;font-size:25px;margin-right:30px;color:#49221a">Memory数据</span>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(1)">高端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(2)">中端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(3)">低端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(4)">全部机型</el-button>
                  <el-select v-model="selectDevices" @change="selectDevice" filterable  no-match-text="没有找到该机型数据" popper-class="select-option" style="width:250px;margin-left:20px;" size="mini" clearable placeholder="自定义机型">
                    <el-option v-for="(item,index) in alldevices" :key="index" :label="item.name" :value="item.number">
                    </el-option>
                  </el-select>                   
              </div>
              <div v-if="testData[0].device" class="max_min_avg">
                  <div class="max_min_avg_detail">最大值
                    <div v-for="(item,index) in data_model3" :key="index" :style="{color:color3[index]}">{{item.ProjectName}}:{{item.max}}</div>
                  </div>
                  <div class="max_min_avg_detail">最小值
                    <div v-for="(item,index) in data_model3" :key="index" :style="{color:color3[index]}">{{item.ProjectName}}:{{item.min}} </div>
                  </div>
                  <div class="max_min_avg_detail">平均值
                    <div v-for="(item,index) in data_model3" :key="index" :style="{color:color3[index]}">{{item.ProjectName}}:{{item.avg}} </div>
                  </div>
              </div> 
                <div style="height:450px;width:auto" id="Memery">
              </div>
              
            </el-card>
          <!-- 5.流量 -->
            <el-card   style="margin-bottom:30px;" >
               <div style="margin-bottom:10px">
                  <span style="font-weight:700;font-size:25px;margin-right:30px;color:#49221a">流量数据</span>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(1)">高端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(2)">中端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(3)">低端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(4)">全部机型</el-button>
                  <el-select v-model="selectDevices" @change="selectDevice" filterable  no-match-text="没有找到该机型数据" popper-class="select-option" style="width:250px;margin-left:20px;" size="mini" clearable placeholder="自定义机型">
                    <el-option v-for="(item,index) in alldevices" :key="index" :label="item.name" :value="item.number">
                    </el-option>
                  </el-select>              
              </div>
              <div v-if="testData[0].device" class="max_min_avg">
                  <div class="max_min_avg_detail">最大值
                    <div v-for="(item,index) in data_model4" :key="index" :style="{color:color4[index]}">{{item.ProjectName}}:{{item.max}}
                    <!-- <span style="color:red">{{item.max}} </span> -->
                    </div>
                  </div>
                  <div class="max_min_avg_detail">最小值
                    <div v-for="(item,index) in data_model4" :key="index" :style="{color:color4[index]}">{{item.ProjectName}}:{{item.min}} </div>
                  </div>
                  <div class="max_min_avg_detail">平均值
                    <div v-for="(item,index) in data_model4" :key="index" :style="{color:color4[index]}">{{item.ProjectName}}:{{item.avg}} </div>
                  </div>
              </div>   
                <div style="height:450px;width:auto" id="Net">
              </div>
              
            </el-card>
          <!-- 6.电量 -->
            <el-card   v-if="ishideEle" style="margin-bottom:30px;" >
               <div style="margin-bottom:10px">
                  <span style="font-weight:700;font-size:25px;margin-right:30px;color:#49221a">电量</span>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(1)">高端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(2)">中端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(3)">低端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(4)">全部机型</el-button>
                  <el-select v-model="selectDevices" @change="selectDevice" filterable  no-match-text="没有找到该机型数据" popper-class="select-option" style="width:250px;margin-left:20px;" size="mini" clearable placeholder="自定义机型">
                    <el-option v-for="(item,index) in alldevices" :key="index" :label="item.name" :value="item.number">
                    </el-option>
                  </el-select>
              </div>
             <div v-if="testData[0].device" class="max_min_avg">
                  <div class="max_min_avg_detail">最大值
                    <div v-for="(item,index) in data_model5" :key="index" :style="{color:color5[index]}">{{item.ProjectName}}:{{item.max}}
                    <!-- <span style="color:red">{{item.max}} </span> -->
                    </div>
                  </div>
                  <div class="max_min_avg_detail">最小值
                    <div v-for="(item,index) in data_model5" :key="index" :style="{color:color5[index]}">{{item.ProjectName}}:{{item.min}} </div>
                  </div>
                  <div class="max_min_avg_detail">平均值
                    <div v-for="(item,index) in data_model5" :key="index" :style="{color:color5[index]}">{{item.ProjectName}}:{{item.avg}} </div>
                  </div>
              </div>              
                <div style="height:450px;width:auto" id="Ele">
              </div>
              
            </el-card> 
          <!-- 7.温度 -->
            <el-card  v-if="ishideTem" style="margin-bottom:30px;">
               <div style="margin-bottom:10px">
                  <span style="font-weight:700;font-size:25px;margin-right:30px;color:#49221a">温度</span>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(1)">高端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(2)">中端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(3)">低端机型</el-button>
                  <el-button round size="mini" style="color:grey"  @click="getXnData(4)">全部机型</el-button>
                  <el-select v-model="selectDevices" @change="selectDevice" filterable  no-match-text="没有找到该机型数据" popper-class="select-option" style="width:250px;margin-left:20px;" size="mini" clearable placeholder="自定义机型">
                    <el-option v-for="(item,index) in alldevices" :key="index" :label="item.name" :value="item.number">
                    </el-option>
                  </el-select>                 
              </div>
              <div v-if="testData[0].device" class="max_min_avg">
                  <div class="max_min_avg_detail">最大值
                    <div v-for="(item,index) in data_model6" :key="index" :style="{color:color6[index]}">{{item.ProjectName}}:{{item.max}}
                    <!-- <span style="color:red">{{item.max}} </span> -->
                    </div>
                  </div>
                  <div class="max_min_avg_detail">最小值
                    <div v-for="(item,index) in data_model6" :key="index" :style="{color:color6[index]}">{{item.ProjectName}}:{{item.min}} </div>
                  </div>
                  <div class="max_min_avg_detail">平均值
                    <div v-for="(item,index) in data_model6" :key="index" :style="{color:color6[index]}">{{item.ProjectName}}:{{item.avg}} </div>
                  </div>
              </div>
                <div style="height:450px;width:auto" id="Tem">
              </div>
              
            </el-card>
        </div>  
        </el-card>
        <el-dialog title="自定义数据衡量标准" :visible.sync="dialogVisable" width="50%" height=auto>
          <el-form :model="Customize" label-width="120px">
            <el-form-item label="平均FPS">
              <el-input v-model="Customize.AvgFps"></el-input>
            </el-form-item>
            <el-form-item label="FPS超过25占比">
              <el-input v-model="Customize.Fpsover25"></el-input>
            </el-form-item>
            <el-form-item label="平均Cpu占用">
              <el-input v-model="Customize.AvgCpu"></el-input>
            </el-form-item>
            <el-form-item label="最大Cpu占用">
              <el-input v-model="Customize.MaxCpu"></el-input>
            </el-form-item>
            <el-form-item label="平均内存">
              <el-input v-model="Customize.AvgMemory"></el-input>
            </el-form-item>
            <el-form-item label="最大内存">
              <el-input v-model="Customize.MaxMemory"></el-input>
            </el-form-item>
            <el-form-item label="平均流量">
              <el-input v-model="Customize.AvgNet"></el-input>
            </el-form-item>
            <el-form-item label="平均耗电量">
              <el-input v-model="Customize.AvgEle"></el-input>
            </el-form-item>
            <el-form-item label="平均温度">
              <el-input v-model="Customize.AvgTem"></el-input>
            </el-form-item>
            <el-form-item label="最大温度">
              <el-input v-model="Customize.MaxTemp"></el-input>
            </el-form-item>  
            <div style="text-align:center">
            <el-button type="primary" round @click="dialogVisable=false" size="mini">确定</el-button>
            <el-button type="primary" round @click="init" size="mini">还原</el-button>
            </div>
          </el-form>
        </el-dialog>
      </el-main> 
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  data(){
    return{
      imgUrl:'http://10.0.10.246:80/icon/',
      dialogVisable:false,//弹出框
      //自定义数据衡量标准
      Customize:{
        ProjectName:'行业标准',
        AvgFps:25,
        Fpsover25:90,
        AvgCpu:30,
        MaxCpu:60,
        AvgMemory:800,
        MaxMemory:1200,
        AvgNet:315,
        AvgEle:666,
        AvgTem:40,
        MaxTemp:45,
      },

      idList:[] ,      //接受版本id
      BrokenLine:null,
      selectBarFixed : false,    
      color1:['#ff7f50','#87cefa','#da70d6','#F00078','#9D9D9D','#FF0000'],
      color2:['#32cd32','#6495ed','#ff69b4','#F00078','#B15BFF','#EA7500'],
      color3:['#ba55d3','#cd5c5c','#ffa500','#00FFFF','#28FF28','#82D900'],
      color4:['#40e0d0','#1e90ff','#ff6347','#804040','#5A5AAD','#DAB1D5'],
      color5:['#7b68ee','#00fa9a','#ffd700','#da70d6','#5A5AAD','#6699FF'],
      color6:['#6699FF','#ff6666','#3cb371','#da70d6','#D1E9E9','#40e0d0'],   
      
     
      deviceslist:[],//横坐标-设备
      Xdata:[],//横坐标-时间
      dataVarible:[],//动态变量
      alldata:[],//概览数据
      testData:[{devices:'',  }],//性能数据
      type1:1,//高端
      type2:2,//中端
      type3:3,//低端
      type4:4,//全部
      alldevices:[],// 测试设备列表
      selectDevices:'',//自定义显示的设备
      timeout:null,
      // 最大值、最小值、平均值展示模板
      data_model:{
        ProjectName:'',
        max:'',
        min:'',
        avg:'',
      },
      data_model1:[],
      data_model2:[],
      data_model3:[],
      data_model4:[],
      data_model5:[],
      data_model6:[],
      // 是否隐藏温度电量
      ishideEle:true,
      ishideTem:true,
    }
  },
  created() { 
    // 接受传送过来的参数
      this.idList = this.$route.query.idList;
      this.getData(this.idList)
      this.getXnData(1)
      // this.DataOption();
      // for(let i=0;i<this.testData.length;i++){
      //   var data = 'data'
      //   var dataVarible1={}
      //   dataVarible1[data]=[]
      //   dataVarible1[data].length= this.deviceslist.length
      //   this.dataVarible[i] = dataVarible1
      // }    

  },
  mounted(){
    // 使用
    // setTimeout(()=>{
    //   let Conf="全部"
    //   let Fps="Fps";
    //   let Cpu="Cpu";
    //   let Memery="Memery";
    //   let Net = "Net";
    //   let Ele ="Ele";
    //   let Tem = "Tem"
    //   this.DoEchart(Fps,Conf);
    //   this.DoEchart(Cpu,Conf);
    //   this.DoEchart(Memery,Conf);
    //   this.DoEchart(Net,Conf);
    //   this.DoEchart(Ele,Conf);
    //   this.DoEchart(Tem,Conf);
    // },1000)
    
    window.addEventListener('scroll',this.handleScroll);
  },
  destroyed(){
    window.removeEventListener('scroll',this.handleScroll)
  },
  methods:{
    //自定义标准还原为默认
    init(){
      this.Customize={
        ProjectName:'行业标准',
        AvgFps:25,
        Fpsover25:90,
        AvgCpu:30,
        MaxCpu:60,
        AvgMemory:800,
        MaxMemory:1200,
        AvgNet:315,
        AvgEle:666,
        AvgTem:40,
        MaxTemp:45,
      }
    },
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
          // 接下来就是xlsx
          wb = XLSX.read(binary, {
            type: 'binary'
          })
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          // 自定义方法向父组件传递数据
          console.log('outdata = ' + JSON.stringify(outdata))
          that.$emit('getResult', outdata)
        }
        reader.readAsArrayBuffer(f)
      }
      reader.readAsBinaryString(f)
      // 处理读取的数据


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
      this.alldata = res.data.dict.version_list
      this.setYdata() //动态变量初始化，选择全部机型时会用到
      console.log(this.alldata) 
      if(this.alldata.length==1){
        this.alldevices = this.alldata[0].Devices
      }else{
        for(let i=0;i<this.alldata.length;i++){
          this.alldevices = this.alldevices.concat(this.alldata[i].Devices)
        }
      }
      console.log(this.alldevices)
      let arrTempary =[]
      for(let item1 of this.alldevices){  //数组对象去重
        let flag = true
        for(let item2 of arrTempary){
          if(item1.number == item2.number){
            flag=false
          }
        }
        if(flag){
          arrTempary.push(item1)
        }
      }  
      this.alldevices = arrTempary
      console.log(this.alldevices)
    },
    // 动态变量赋值-y轴
    setYdata(){
     for(let i=0;i<this.alldata.length;i++){
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
        case 1: divId = "Fps_over";
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
    // 全部机型对比时x轴数据去重处理
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
    //全部机型时Y轴数据处理 
    DataOption2(xndata){
      if(xndata[0] && this.testData[0] && this.deviceslist[0] &&this.dataVarible[0]){ //防止浏览器报错
        let n = this.testData.length; 
        if(n<2){
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
      }
     
      // return this.dataVarible;
    },

    DoEchart(type,Conf) {
      this.$nextTick(()=>{
          var DataModel={
              name: null,
              type: 'line',
              connectNulls:true,
              data: null,
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
          let xaxis = []
          let setData=[] 
          var setName=[] //对比名
          let xnData=[] // 全部机型列表，未去重
          let Xinterval=0 //x轴间隔
          // setData.length=this.testData.length
          // 设备对比名方法
          for(let i=0;i<this.testData.length;i++){
            setData[i]= Object.assign({},DataModel) //只传值，不传对象
            // setData[i].name=this.testData[i].ProjectName
            setData[i].name=this.testData[i].ProjectName+"v_"+this.testData[i].TestVersion
            setName.push(setData[i].name)
          }
          var SetColor=[]   
          
          let devicesType
          if(Conf=="全部"){
            devicesType ="N/A"
          }else{
            devicesType = this.testData[0].device
          }
          if(type == "Fps"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Fps_over'))
            SetColor = this.color1 
            if(Conf ==="全部"){
              xaxis = this.deviceslist
              for(let i=0;i<this.testData.length;i++){  
                xnData.push(this.testData[i].allFps)      
              }
              this.DataOption2(xnData); // 处理Y轴数据
              for(let i=0;i<this.testData.length;i++){  
               setData[i].data=this.dataVarible[i].data  //Y轴数据赋值
             } 
            }else{
              xaxis = this.Xdata
              Xinterval = 180
              this.data_model1 = [];
              for(let i=0;i<this.testData.length;i++){  
                setData[i].data=this.testData[i].perf_data.fps  //Y轴数据赋值
              //最大最小平均值        
                this.data_model1[i]=Object.assign({},this.data_model);
                this.data_model1[i].ProjectName=this.testData[i].ProjectName
                this.data_model1[i].max=Math.max.apply(null,this.testData[i].perf_data.fps)
                this.data_model1[i].min=Math.min.apply(null,this.testData[i].perf_data.fps)
                this.data_model1[i].avg=this.anverage(this.testData[i].perf_data.fps)
              } 
              console.log(this.data_model1);
            }
         
          }else if(type=="Cpu"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Cpu'))
            SetColor = this.color2
            if(Conf ==="全部"){
              xaxis = this.deviceslist
              for(let i=0;i<this.testData.length;i++){  
                xnData.push(this.testData[i].allCpu)      
              }
              this.DataOption2(xnData); // 
              for(let i=0;i<this.testData.length;i++){  
              setData[i].data=this.dataVarible[i].data  //Y轴数据赋值
             } 
            }else{
              xaxis = this.Xdata
              Xinterval = 180
              this.data_model2 = [];
              for(let i=0;i<this.testData.length;i++){  
                setData[i].data=this.testData[i].perf_data.cpu  //Y轴数据赋值
                this.data_model2[i]=Object.assign({},this.data_model);
                this.data_model2[i].ProjectName=this.testData[i].ProjectName
                this.data_model2[i].max=Math.max.apply(null,this.testData[i].perf_data.cpu)
                this.data_model2[i].min=Math.min.apply(null,this.testData[i].perf_data.cpu)
                this.data_model2[i].avg=this.anverage(this.testData[i].perf_data.cpu)                
              } 
            } 

          }else if(type=="Memery"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Memery'))
            SetColor = this.color3

            if(Conf ==="全部"){
              xaxis = this.deviceslist
              for(let i=0;i<this.testData.length;i++){  
                xnData.push(this.testData[i].allMemery)      
              }
              this.DataOption2(xnData); //设备去重 
              for(let i=0;i<this.testData.length;i++){  
               setData[i].data=this.dataVarible[i].data  //Y轴数据赋值
             } 
            }else{
              xaxis = this.Xdata
              Xinterval = 180
              this.data_model3 = [];
              for(let i=0;i<this.testData.length;i++){  
                setData[i].data=this.testData[i].perf_data.memory  //Y轴数据赋值
                this.data_model3[i]=Object.assign({},this.data_model);
                this.data_model3[i].ProjectName=this.testData[i].ProjectName
                this.data_model3[i].max=Math.max.apply(null,this.testData[i].perf_data.memory)
                this.data_model3[i].min=Math.min.apply(null,this.testData[i].perf_data.memory)
                this.data_model3[i].avg=this.anverage(this.testData[i].perf_data.memory)               
              } 
            } 
            
            
          }else if(type=="Net"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Net'))
            type = "流量"
            SetColor = this.color4
             if(Conf ==="全部"){
              xaxis = this.deviceslist
              for(let i=0;i<this.testData.length;i++){  
                xnData.push(this.testData[i].allNet)      
              }
              this.DataOption2(xnData); //设备去重 
              for(let i=0;i<this.testData.length;i++){  
                setData[i].data=this.dataVarible[i].data  //Y轴数据赋值               
             } 
            }else{
              xaxis = this.Xdata
              Xinterval = 180
              this.data_model4 = [];
              for(let i=0;i<this.testData.length;i++){  
                setData[i].data=this.testData[i].perf_data.net  //Y轴数据赋值
                this.data_model4[i]=Object.assign({},this.data_model);
                this.data_model4[i].ProjectName=this.testData[i].ProjectName
                this.data_model4[i].max=Math.max.apply(null,this.testData[i].perf_data.net)
                this.data_model4[i].min=Math.min.apply(null,this.testData[i].perf_data.net)
                this.data_model4[i].avg=this.anverage(this.testData[i].perf_data.net) 
              } 
            }


          }else if(type=="Ele"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Ele'))
            type = "电量"
            SetColor = this.color5
            if(Conf ==="全部"){
              xaxis = this.deviceslist
              for(let i=0;i<this.testData.length;i++){  
                xnData.push(this.testData[i].allEle)      
              }
              this.DataOption2(xnData); //设备去重 
              for(let i=0;i<this.testData.length;i++){  
               setData[i].data=this.dataVarible[i].data  //Y轴数据赋值
             } 
            }else{
              xaxis = this.Xdata
              Xinterval = 180
              this.data_model5 = [];
              for(let i=0;i<this.testData.length;i++){  
                setData[i].data=this.testData[i].perf_data.bat  //Y轴数据赋值
                this.data_model5[i]=Object.assign({},this.data_model);
                this.data_model5[i].ProjectName=this.testData[i].ProjectName
                let filterdata = this.deleteNaN(this.testData[i].perf_data.bat) 
                this.data_model5[i].max=Math.max.apply(null,filterdata)
                this.data_model5[i].min=Math.min.apply(null,filterdata)
                this.data_model5[i].avg=this.anverage(filterdata)                 
              } 
            }
            
            
          }else if(type=="Tem"){
            this.BrokenLine = this.$echarts.init(document.getElementById('Tem'))
            type = "温度"
            SetColor = this.color6
            if(Conf ==="全部"){
              xaxis = this.deviceslist
              for(let i=0;i<this.testData.length;i++){  
                xnData.push(this.testData[i].allTem)      
              }
              this.DataOption2(xnData); //设备去重 
              for(let i=0;i<this.testData.length;i++){  
               setData[i].data=this.dataVarible[i].data  //Y轴数据赋值
             } 
            }else{
              xaxis = this.Xdata
              Xinterval = 180 
              this.data_model6 = [];
              for(let i=0;i<this.testData.length;i++){  
                setData[i].data=this.testData[i].perf_data.temp  //Y轴数据赋值
                this.data_model6[i]=Object.assign({},this.data_model);
                this.data_model6[i].ProjectName=this.testData[i].ProjectName
                let filterdata = this.deleteNaN(this.testData[i].perf_data.temp) 
                this.data_model6[i].max=Math.max.apply(null,filterdata)
                this.data_model6[i].min=Math.min.apply(null,filterdata)
                this.data_model6[i].avg=this.anverage(filterdata)                
              } 
            }

          }
          // 绘制图表
          let option = {
            grid: {
              show:true,
              left:"12%",
              right:"5%"
            },
            color:SetColor,
            title: {
              text: Conf+'机型对比',
              textStyle: {
                fontSize:15,
              },
              subtext:"机型："+devicesType,
            },
            dataZoom:[{
              type:'slider',
              height:'28',
              show:true,
              xAxisIndex:[0],
              left:'12%',
              bottom:-5,
              start:0,
              end:100,
            }],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:setName,
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
                    axisLabel:{interval:Xinterval},
                    data:xaxis
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series:setData
        }
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
    // 机型性能数据
    async getXnData(typeN){
      var idList=[{
        id:this.idList,
        type:typeN
      }]
      const {data:res} = await this.$http.get("compare_by_device_position",{
        params:idList})
      if(res.meta.status!==200){
        return this.$message.error(res.meta.msg)
      }
      this.testData = res.data.dict.version_list
      console.log(this.testData)
      this.handleData(typeN)
    },
    // 自定义机型时
    async selectDevice(val){
      console.log(val)
      var setdata=[{
        id:this.idList,
        number:val
        }]
      const {data:res} = await this.$http.get("version_compare_by_device",{
      params:setdata})
      if(res.meta.status!==200){
        return this.$message.error(res.meta.msg)
      }
      this.testData = res.data.dict.version_list
      console.log(this.testData)
      this.handleData(5)
    },
      // 性能数据处理
    handleData(typeN){
      if(typeN!=4){
        this.Xdata=[]
        let xDemo=[]
        //判断时长，以长的为横坐标
        if(this.testData.length==1){
          //横坐标直接赋值
          xDemo = this.testData[0].perf_data.timestamp
        }else{
          let max = 0
          if(this.testData[0].device!="None"){
            max=this.testData[0].perf_data.timestamp.length;
          }else{
            return this.$message.error(this.testData[0].ProjectName+"未测试该机型,对比数据无法展示")
          }
          let a=0;
          for(let i=1;i<this.testData.length;i++){
             //取最大值赋值
            if(this.testData[i].device=="None"){
              return this.$message.error(this.testData[i].ProjectName+"未测试该机型,对比数据无法展示")
            }
            if(max<this.testData[i].perf_data.timestamp.length){
              max = this.testData[i].perf_data.timestamp.length
              a = i
            }
          }
          xDemo = this.testData[a].perf_data.timestamp
        }
        // console.log(xDemo)
        //   // 时间轴数据处理
        for(let i=0;i<xDemo.length;i++){
          let a =xDemo[i]
          let min = parseInt(a/(1000*60))
          if(min<10){
            min = '0'+min
          }
          let second=parseInt((a%(1000*60))/1000)
          if(second<10){
            second = '0'+second
          }
          let x = min+":"+second
          this.Xdata.push(x)
        } 
      }else{
        this.DataOption();
      }
     
      // 调用echart
         setTimeout(()=>{
          let Conf = ""
          if(typeN==1){
            Conf="高端"
          }else if(typeN==2){
            Conf="中端"
          }else if(typeN==3){
            Conf="低端"
          }else if(typeN==4){
            Conf="全部"
          }else{
            Conf="自定义"
          }
          
          let Fps="Fps";
          let Cpu="Cpu";
          let Memery="Memery";
          let Net = "Net";
          let Ele ="Ele";
          let Tem = "Tem";
          this.DoEchart(Fps,Conf);
          this.DoEchart(Cpu,Conf);
          this.DoEchart(Memery,Conf);
          this.DoEchart(Net,Conf);
          // 判断电量和温度是否为零，决定隐藏对应面板
          let sum1 = 0
          let sum2 =0
          for(let i=0;i<this.alldata.length;i++){
            sum1 = sum1+this.alldata[i].AvgEle
            sum2 = sum2+this.alldata[i].AvgTem
          }          
          if(sum1==0){this.ishideEle = false}else{this.DoEchart(Tem,Conf);}
          if(sum2==0){this.ishideTem = false}else{this.DoEchart(Ele,Conf);}
        },500)
   },
    // 求平均值函数
    anverage(arr){
      let sum=0
      let avg =0 
      for(let i=0;i<arr.length;i++){
        sum = sum+arr[i];
      }
      avg = Math.round(sum/arr.length)
      return avg;
    },
    // 去除NaN
    deleteNaN(arr){
      var newarr = []
      for(let i=0;i<arr.length;i++){
        if(arr[i]!=="N/A"){
          newarr.push(arr[i])
        }
      }
      return newarr
    }
  }
} 
</script>


<style >
.el-input__inner{
  border-radius:20px
}
.isFixed{
  position: fixed;
  top:0;
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
.max_min_avg{
  width:140px;
  margin-top:65px;
  margin-left: 20px;
  float: left;;
}
.max_min_avg_detail{
  margin-bottom:30px;
  padding-top:10px;
  font-weight:700;
  font-size:15px;
}
</style>