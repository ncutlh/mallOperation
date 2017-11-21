import {Component, OnInit} from "@angular/core";
import {PageService} from "../../../service/page/Page.service";
import {Router, ActivatedRoute} from "@angular/router";
import {NzModalService, NzMessageService} from "ng-zorro-antd";
import {HttpData} from "../../../http/HttpData";
import {Http} from "../../../common/http/Http";
import {isNull} from "util";
import {isUndefined} from "util";
@Component({
  selector:"act-concat-good",
  templateUrl:"ConcatGood.component.html",
  styleUrls:["ConcatGood.component.css"]
})

export class  ConcatGoodComponent implements OnInit{
  curActivity:any;//当前活动
  goodList:any=[];//商品列表
  activityList:any=[];//活动列表
  isCollapse:boolean=false;
  ngLoad:boolean=false;
  checkAll:boolean = false;//全选
  doCheckAll:boolean=false;//是否可以全选
  searchKey:any= '';
  page:any = {
    pageNo:1,
    pageSize:10,
    total:0
  };
  picUrl:string = '';//图片公共地址
  condition:any={};//条件
  idList:any=[];//选中商品ID集合
  nowDate:any;//当前时间
  constructor(private pageObj : PageService,private http:Http,
              private router:Router,private route :ActivatedRoute,private  PicUrl:HttpData,
              private nzModal :NzModalService ,private nzMessage:NzMessageService){}

  ngOnInit(){
    this.picUrl = this.PicUrl.PicUrl;
    let date = new Date();
    this.nowDate = date.getTime();
    this.init();
    this.getActivityList();
  }
  /**
   * 初始化
   */
  init(){
    let url = 'backstage/good/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+
      '&searchKey='+this.searchKey+'&saleStatus=1';
    /*数据初始化*/
    this.ngLoad=true;
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        console.log(res);
        if(res["total"]!=0){
          this.goodList = res["list"];
          this.page.total=res["total"];
        }
      },
      err=>{
        console.log(err);
      });

  }

  /**
   * 页面跳转
   * @param name
   * @param val
   */
  skipToPage(name,val){
    console.log(name);
    if(val){
      this.router.navigate([".."+name,val],{relativeTo:this.route});
    }else{
      this.router.navigate([".."+name],{relativeTo:this.route});
    }
  }

  /**
   * 获取活动列表
   */
  getActivityList(){
    let url = 'backstage/activity/findByCondition?pageNo=1&pageSize=10000&status=0&type=3';
    this.http.get(url).subscribe(
      res=>{
        if(res["total"]!=0){
          this.activityList = res["list"];
        }
      },
      err=>{
        console.log(err);
      }
    )
  }

  /*分页*/
  pageChangeHandler(val){
    this.ngLoad=true;
    this.page.pageNo=val;
    //拼接地址
    let url = 'backstage/good/findByCondition?pageNo='+val+'&pageSize='+this.page.pageSize+
      '&searchKey='+this.searchKey+'&saleStatus=1';
    for(let key in this.condition){
      if(isNull(this.condition[key])){
        continue;
      }
      url+="&"+key+"="+this.condition[key]
    }

    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        /*给checkbox赋值*/
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.idList=[];
        if(res["total"]!=0){
          this.checkAll=false;
          this.goodList = res["list"];
          this.page.total=res["total"];
        }
      },
      err=>{
        this.ngLoad=false;
        console.log(err);
      });
  };

  /*size改变*/
  pageSizeChangeHandler(val){
    this.ngLoad=true;
    this.page.pageSize=val;
    //拼接地址
    let url = 'backstage/good/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+val+
      '&searchKey='+this.searchKey+'&saleStatus=1';
    for(let key in this.condition){
      if(isNull(this.condition[key])){
        continue;
      }
      url+="&"+key+"="+this.condition[key]
    }

    this.http.get(url).subscribe(res=>{
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.idList=[];
        this.ngLoad=false;
        if(res["total"]!=0){
          this.checkAll=false;
          this.goodList = res["list"];
          this.page.total=res["total"]
        }
      },
      err=>{
        this.ngLoad=false;
        console.log(err);
      });
  };

  /**
   * 关键字查询
   */
  search(){
    this.ngLoad=true;
    this.page.pageNo=1;
    //拼接地址
    let url = 'backstage/good/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+
      '&searchKey='+this.searchKey+'&saleStatus=1';
    for(let key in this.condition){
      if(isNull(this.condition[key])){
        continue;
      }
      url+="&"+key+"="+this.condition[key]
    }

    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.idList=[];
        if(res["total"]!=0){
          this.checkAll=false;
          this.goodList = res["list"];
          this.page.total=res["total"]
        }
      },
      err=>{
        console.log(err);
      });
  }

  /**
   * 比较时间
   * @param date
   */
  compareDate(startDate,endDate){
    let sDate = new Date(startDate).getTime();
    let eDate = new Date(endDate).getTime();
    let now =new Date().getTime();
     if(now<sDate||now<eDate&&now>sDate){
       return false ;
     }else {
       return true;
     }
  }

  /**
   * 选择
   * @param flag 选中标志
   * @param val 商品id
   * @param type 类型 0:全选，1:单选
   */
  selectItem(flag,val,type,index?){
    if(type==1){
      if(flag){
        //单选勾选操作
        this.idList.push(val);
        if(this.idList.length==this.goodList.length){
          this.checkAll = true;
        }else {
          this.checkAll=false;
        }
      }else {
        //单选取消操作
        this.checkAll=false;
        let index = this.idList.indexOf(val);
        this.idList.splice(index,1);
      }
    }else {
      if(flag){
        //全选
        for(let i =0;i<val.length;i++){
          if(this.idList.length==0){
            this.goodList[i]['checked']=true;
            this.idList.push(val[i].id);
            continue;
          }
          //检测是否在idList中已存在
          for(let index in this.idList){
            if(val[i].id==this.idList[index]){
              break;
            }else if((Number(index)+1)==this.idList.length){
              this.goodList[i]['checked']=true;
              this.idList.push(val[i].id);
            }
          }
        }
      }else {
        //全不选
        for(let i =0;i<val.length;i++){
          this.goodList[i]['checked']=false;
        }
        this.idList=[]
      }
    }
    console.log(this.idList);
  };


  /**
   * 禁止开始时间
   * @param startValue
   * @returns {boolean}
   */
  disabledStartDate=(startValue)=>{
    if(!startValue||!this.condition.endDate){
      return false;
    }
    return startValue.getTime()>=this.condition.endDate.getTime();
  }

  /**
   * 禁止结束时间
   * @param endValue
   * @returns {boolean}
   */
  disabledEndDate=(endValue)=>{
    if(!this.condition.startDate||!endValue){
      console.log(1);
      return false
    }
    return endValue.getTime() <= this.condition.startDate.getTime();
  }

  /**
   * 取消关联商品
   */
  unconcatConfirm(){
    if(this.idList.length==0){
      this.nzMessage.warning("请先选择商品");
      return;
    }else if(isUndefined(this.curActivity)){
      this.nzMessage.warning("请先选择活动类型");
      return;
    }
    this.nzModal.warning({
      title:"关联提示",
      content:"是否确认取消关联已选商品",
      onOk:()=>{
        this.unconcatHandler();
      }
    });
  }

  /**
   * 取消关联操作
   */
  unconcatHandler(){
    this.http.post("backstage/activity/bindActivityWithGood",{activityId:this.curActivity,goodIdList:this.idList}).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("关联成功");
          this.pageChangeHandler(1);
          this.idList=[];//清空选中的id
        }else{
          this.nzMessage.success("关联失败");
        }
      },
      err=>{
        console.log(err);
      }
    )
  }
}
