Ext.onReady(function(){



	var search = Ext.Object.fromQueryString(window.parent.location.search);
	var websiteId =JSGetQueryString('websiteId');
	var website = search.website;


	//邮件模版文件名的store
	var TemplateNamesStore = Ext.create("CGP.configuration.ticket.TicketStore",{
		params :{
			target : 'manager',
			websiteId : websiteId
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
			model : 'CGP.configuration.ticket.TicketModel',
			remoteCfg : false,
            title: i18n.getKey('ticketReceiver'),
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
				xtype : 'emailsfield',
				name : 'emails',
				fieldLabel : i18n.getKey('setAddressee'),
				emailWidth : 150,
				panelConfig : {
					width : 500,
					minHeight : 300
				}
			}
      		]
		},
		listeners : {}
	});

	Ext.Ajax.request({
		url : adminPath + 'api/ticketReceivers',
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
				var model = Ext.create("CGP.configuration.ticket.TicketModel",r.data);
				editPage.form.form.loadModel(model);
			}
		}
	});
});
