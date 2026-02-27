Ext.define("CGP.uat.controller.MainController",{
	requires : ["CGP.uat.model.Website","CGP.uat.model.UAT"],
	
	editWindow : null,//用于编辑修改和创建对象的window
	mainPage: null,//存放主页面对象
	
	confirmedWindow : null,//审批window
	

	constructor : function(){

		this.callParent(arguments);
	},
	
	openCreateWindow : function(record,mainPage){
		var me = this;
		me.mainPage = mainPage;
		if(Ext.isEmpty(me.editWindow)){
			me.editWindow = Ext.create("CGP.uat.view.window.Edit",{
				record : record,
				controller : me,
				closeAction: "hide"
			});
		}else{
			me.editWindow.refresh(record);
		}
		me.editWindow.show();
	},
	save : function(){
		var me = this;
		var submitModel = me.editWindow.getSubmitValue();
		var mask = me.editWindow.form.setLoading();
		submitModel.save({
			success : function(){
				me.editWindow.close();
				me.mainPage.filter.searchActionHandler();
				Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('savesuccess') + "!");
			},
			failure : function(record,options){
				var errorStr = options.error;
				errorStr = errorStr.substring(errorStr.indexOf("|") + 1 );
				var errorObject = Ext.Object.fromQueryString(errorStr.replace(":","="));
				for(k in errorObject){
					me.editWindow.form.getComponent(k).markInvalid(errorObject[k]);
				}
				me.mainPage.filter.searchActionHandler();
			},
			callback : function(){
				mask.hide();
			}
		});
	},
	
	openConfirmedWindow : function(record,mainPage){
		var me = this;
		me.mainPage = mainPage;
		me.confirmedWindow = Ext.create("CGP.uat.view.window.Confirmed",{
				record : record,
				controller : me
			});
		me.confirmedWindow.show();
	},
	
	confirmedUAT : function(status){
		var me = this;
		var id = me.confirmedWindow.record.get("id");
		var url = adminPath + "api/admin/uat/"+ id +"/status";
		Ext.Ajax.request({
			url : url,
			method : "PUT",
			headers  : {
				Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
			},
			success : function(response, opts){
				responseObject = eval("("+response.responseText+")");
				if(responseObject.success){
					me.mainPage.filter.searchActionHandler();
					me.confirmedWindow.close();
				}else{
					Ext.Msg.alert(i18n.getKey('prompt'),responseObject.data.message );
				}
			},
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            },
			jsonData : {
				status : status,
				remark : me.confirmedWindow.form.getComponent("remark").getValue()
			}
		});
	},
	
	OpenLogsWindow : function(record){
		var me = this;
		me.logsWindow = Ext.create("CGP.uat.view.window.Logs",{
			record : record
		});
		me.logsWindow.show();
	}
	
});