Ext.define('CGP.partner.view.CustomerEmailSendMail', {
	extend: 'Ext.window.Window',

	modal: true,
	bodyStyle: 'padding:10px',
	height: 400,
	width: 500,
	autoScroll: true,
	autoShow: true,

	initComponent: function() {
        var me= this;

		var fieldText = null;
		me.title = i18n.getKey('customerEmailSendMail');
		var myMask = new Ext.LoadMask(me, {
			msg: "加载中..."
		});
		me.listeners = {
			show: function() {
				myMask.show();
			}
		};

		var store = Ext.create('CGP.partner.store.PartnerConfigStore', {
			partnerId: me.partnerId,
			groupId: me.groupId,
			websiteId: me.websiteId,
			listeners: {

				load: function() {
					myMask.hide();
				}
			}
		});
		var bbar = Ext.create('Ext.toolbar.Toolbar', {
			items: [
				 {
					itemId: 'btnVerifyMail',
					text: i18n.getKey('verifyMail'),
                    iconCls: 'icon_verify',
					handler: function() {
						var data = {};
						me.form.items.each(function(item) {
							data[item.name] = item.getValue();
						});
						me.controller.showVerifyMailWin(data);
					}
				},'->',  {
					itemId: 'btnSave',
					text: i18n.getKey('save'),
					iconCls: 'icon_save',
					handler: function() {
						//保存修改的配置
						me.controller.modify(page, store);
					}

				}, {
					itemId: 'btnReset',
					text: i18n.getKey('reset'),
					iconCls: 'icon_reset',
					handler: function() {
						//重置保存的配置
						me.controller.reset(page, store);
					}
				}
			]
		});
		var page = Ext.create("Ext.form.Panel", {
			header: false,
			//            height: 400,
			width: '100%',
			border: false,
			layout: {
				type: 'table',
				columns: 1
			},
			items: []
		});

		store.load({
			callback: function(records, options, success) {
				function addFieldText(records) {
					var arr = [];
					//预期写定的标签name
					keyhead = 'PARTNER_' + me.partnerId;
					var myLabelkey = [{
						title: "host",
						key: keyhead + '_CONFIG_KEY_EMAIL_ORDER_HOST'
					}, {
						title: "address",
						key: keyhead + '_CONFIG_KEY_EMAIL_ORDER_ADDRESS'
					}, {
						title: "username",
						key: keyhead + '_CONFIG_KEY_EMAIL_ORDER_USERNAME'
					}, {
						title: "password",
						key: keyhead + '_CONFIG_KEY_EMAIL_ORDER_PASSWORD'
					}, {
						title: "port",
						key: keyhead + '_CONFIG_KEY_EMAIL_ORDER_PORT'
					}, {
						title: "timeout",
						key: keyhead + '_CONFIG_KEY_EMAIL_ORDER_TIMEOUT'
					}, {
						title: "protocol",
						key: keyhead + '_CONFIG_KEY_EMAIL_ORDER_PROTOCOL'
					}];
					for(var j = 0; j < myLabelkey.length; j++) {
						var index = store.findBy(function(records) {
							return records.get('key') == myLabelkey[j].key;
						});

						if(index > -1) {
							arr.push(j);
							var i = arr.length - 1;
							if(myLabelkey[j].title == 'password') {
								var fieldtext = new Ext.form.field.Text({
									fieldLabel: records[i].get('title'),
									width: 350,
									blankText: 'this value is required',
									value: records[i].get('value'),
                                    key: myLabelkey[j].key,
                                    //id: store.getAt(index).get('id'),
									inputType: 'password',
									name: records[i].get('title'),
									itemId: i
								})
							} else {
								var fieldtext = new Ext.form.field.Text({
									fieldLabel: records[i].get('title'),
									width: 350,
									blankText: 'this value is required',
									value: records[i].get('value'),
                                    key: myLabelkey[j].key,
									//id: store.getAt(index).get('id'),
									//inputType: 'password',
									name: records[i].get('title'),
									itemId: i
								})
							}
						} else {
							if(myLabelkey[j].title == 'password') {
								var fieldtext = new Ext.form.field.Text({
									fieldLabel: myLabelkey[j].title,
									key: myLabelkey[j].key,
									width: 350,
									inputType: 'password',
									blankText: 'this value is required',
									itemId: j
									//value: ""
								})
							} else {
								var fieldtext = new Ext.form.field.Text({
									fieldLabel: myLabelkey[j].title,
									key: myLabelkey[j].key,
									width: 350,
									blankText: 'this value is required',
									itemId: j
									//value: ""
								})
							}
						}
						page.add(fieldtext);
					}
				}
				addFieldText(records);
			}
		});
		me.items = [page];
		me.bbar = bbar,
			me.callParent(arguments);
		me.form = me.down('form');
	}
});