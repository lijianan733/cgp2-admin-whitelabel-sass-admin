Ext.onReady(function(){



	var websiteId = parseInt(JSGetQueryString('websiteId'));


	//邮件模版文件名的store
	var TemplateNamesStore = Ext.create("CGP.configuration.store.MailTemplateFileStore",{
		params :{
			target : 'manager',
			websiteId : websiteId
		}
	});
	TemplateNamesStore.load({
		callback : function(i ,e,u){
			editPage.form.resetForm();
		}
	});


	var editPage = Ext.widget({
		block : 'mailtemplate',
		xtype : 'uxeditpage',
		gridPage: 'mailtemplate.html',
		tbarCfg: {
			btnConfig : {
				hidden : true
			},
			btnCopy : {
				hidden : true
			},
			btnGrid : {
				hidden : true
			},
			btnHelp : {
				hidden : true
			},
			sepEdit : {
				hidden : true
			},
			sepData : {
				hidden : true
			},
            btnCreate: {
                hidden: true,
                handler: function () {
                    this.ownerCt.ownerCt.form.createNewForm();
                }
            },
            btnReset: {
                handler: function () {
                    this.ownerCt.ownerCt.form.resetForm();
                }
            }
        },
		formCfg : {
			model : 'CGP.configuration.invoiceomt.InvoiceMailTemplate',
			remoteCfg : false,
            title: i18n.getKey('Invoice Mail Template'),
			fieldDefaults: {
	            labelAlign: 'right',
	            width: 500,
	            labelWidth : 120,
	            msgTarget: 'side',
	            validateOnChange: false,
	            plugins: [{
	                ptype: 'uxvalidation'
	            }]
	        },
			items : [{
				name:'subject',
				xtype:'textfield',
				fieldLabel: i18n.getKey('subject'),
				allowBlank:false,
				itemId:'subject'
			}, {
				name: "templateId",
				xtype : 'singlegridcombo',
				allowBlank : false,
				fieldLabel : i18n.getKey('mailTemplate') + i18n.getKey('fileName'),
				itemId :'fileName',
				displayField : 'name',
				valueField : 'id',
				store : TemplateNamesStore,
				matchFieldWidth: false,
				multiSelect: false,
				gridCfg: {
					store : TemplateNamesStore,
					mixHeight: 200,
                    width: 500,
                    //hideHeaders : true,
                    columns: [{
                        text: i18n.getKey('mailTemplate') + i18n.getKey('fileName'),
                        width: 200,
                        dataIndex: 'name',
                        renderer : function(value, metaData){
                        	metaData.tdAttr = 'data-qtip="' + "<div>"+value+"</div>"+ '"';
                        	return value;
                        }
         			}, {
                        text: i18n.getKey('description'),
                        width: 370,
                        dataIndex: 'description',
                        renderer : function(value, metaData, record, rowIndex) {
		                    if(typeof value ==="string"){
		                    	var valueStr = '';
		                    	var index = 20;
		                    	for(var i = 0;i < value.length/index;i++){
		                    		var str = value.substring( i * index,( i * index)+index);
		                    		valueStr = valueStr + str ;
		                    		if( i < value.length/index - 1)
		                    			valueStr += "<br>";
		                    	}
			                    value = valueStr;
		                    }
		                    metaData.style = 'color:gray';
			                metaData.tdAttr = 'data-qtip="' + "<div>"+value+"</div>"+ '"';
		                    return value
                        }
         			}]
				}
			},{
				xtype : 'emailsfield',
				name : 'emails',
				fieldLabel : i18n.getKey('setAddressee'),
				emailWidth : 150,
				panelConfig : {
					width : 500,
					minHeight : 300
				}
			}
//			, {
//                xtype: 'combo',
//               	disabled : true,
//                matchFieldWidth: true,
//                itemId: 'websiteCombo',
//                editable:false,
//                fieldLabel: i18n.getKey('website'),
//                allowBlank: false,
//                name: 'websiteId',
//                multiSelect: false,
//                displayField: 'name',
//                valueField: 'id',
//                labelAlign: 'right',
//                store: websiteStore,
//                queryMode: 'remote',
//                pickerAlign: 'bl',
//                value : value
//      		}
      		]
		},
		listeners : {}
	});

	Ext.Ajax.request({
		url : adminPath + 'api/invoicemailtemplates',
		params : {
			websiteId : websiteId
		},
		headers : {
			Authorization : 'Bearer'+Ext.util.Cookies.get("token")
		},
		method : 'GET',
		callback : function(action,options,response){
			var r = Ext.decode(response.responseText);
			if(Ext.isEmpty(r.data)){
				Ext.Msg.alert(i18n.getKey('prompt'),"load invoice mail template error");
			}else{
				var model = Ext.create("CGP.configuration.invoiceomt.InvoiceMailTemplate",r.data);
				editPage.form.form.loadModel(model);
			}
		}
	});
});
