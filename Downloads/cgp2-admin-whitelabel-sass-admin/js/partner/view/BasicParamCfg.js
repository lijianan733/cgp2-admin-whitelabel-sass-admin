Ext.define('CGP.partner.view.BasicParamCfg', {
	extend: 'Ext.window.Window',

	modal: true,
	bodyStyle: 'padding:10px',
	height: 400,
	width: 500,
	autoScroll: true,
	autoShow: true,

	initComponent: function() {
        var me = this;
		var fieldText = null;
		me.title = i18n.getKey('basicParamCfg');
		me.itemId = 'basicParamCfg';
		me.id = 'basicParamCfg';
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
				'->', {
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
			//height: 400,
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
					var arr=[];
					//预期写定的标签name
					var keyhead = 'PARTNER_' + me.partnerId;
					var myLabelkey = [{
						title: "default user id",
						key: keyhead + '_CONFIG_KEY_PARTNER_DEFAULT_USER'
					}, {
						title: "builder预览地址",
						key: keyhead + '_CONFIG_KEY_BUILDER_PREVIEW_URL'
					}, {
						title: "订单号规则",
						key: keyhead + '_CONFIG_KEY_ORDER_NUMBER_RULE'
					}, {
						title: "推送地址",
						key: keyhead + '_CONFIG_KEY_PUSH_ORDER_URL'
					}, {
						title: "需要推送的状态",
						key: keyhead + '_CONFIG_KEY_PUSH_ORDER_STATUSES'
					}, {
						title: "builder编辑地址",
						key: keyhead + '_CONFIG_KEY_BUILDER_EDIT_URL'
					}, {
						title: "推送成功返回信息",
						key: keyhead + '_CONFIG_KEY_PUSH_ORDER_SUCCESS_RESPOSNE'
					}];
					for(var j = 0; j < myLabelkey.length; j++) {
						var index = store.findBy(function(records) {
							return records.get('key') == myLabelkey[j].key;
						});						 
						if(index > -1) {
							arr.push(j);
                            var i=arr.length-1;
							var fieldtext = new Ext.form.field.Text({
								fieldLabel: records[i].get('title'),
								width: 350,
                                key: myLabelkey[j].key,
								blankText: 'this value is required',
								value: records[i].get('value'),
								name: records[i].get('title'),
								itemId: i
							})
						} else {
							var fieldtext = new Ext.form.field.Text({
								fieldLabel: myLabelkey[j].title,
								key: myLabelkey[j].key,
								width: 350,
								blankText: 'this value is required',
								itemId: myLabelkey[j].key
								//value: ""
							})
						}
						page.add(fieldtext);
					}
				}
				addFieldText(records);
			}
		});
		me.items = [page];
		me.bbar = bbar;

			me.callParent(arguments);
	}
});




