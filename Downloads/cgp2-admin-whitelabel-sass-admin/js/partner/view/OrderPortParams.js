Ext.define('CGP.partner.view.OrderPortParams', {
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
		me.title = i18n.getKey('orderPortParams');
		me.id = 'orderPortParams';
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
					var arr=[];
					//预期写定的标签name
					var keyhead = 'PARTNER_' + me.partnerId;
					var myLabelkey = [{
						title: "app_id",
						key: keyhead + '_APP_ID'
					}, {
						title: "app_secret",
						key: keyhead + '_APP_SECRET'
					}, {
						title: "成功返回信息",
						key: keyhead + '_SUCCESS_RESPONSE'
					}, {
						title: "信息处理类",
						key: keyhead + '_MESSAGE_CONVERTER'
					}, {
						title: "订单号字段",
						key: keyhead + '_ORDER_NUMBER'
					}, {
						title: "用户id字段",
						key: keyhead + '_USER_ID'
					}, {
						title: "订单总数量字段",
						key: keyhead + '_TOTAL_QTY'
					}, {
						title: "订单状态字段",
						key: keyhead + '_ORDER_STATUS'
					}, {
						title: "收货城市字段",
						key: keyhead + '_DELIVERY_CITY'
					}, {
						title: "收货省份字段",
						key: keyhead + '_DELIVERY_STATE'
					}, {
						title: "收货邮编字段",
						key: keyhead + '_DELIVERY_POST_CODE'
					}, {
						title: "收货人字段",
						key: keyhead + '_DELIVERY_NAME'
					}, {
						title: "支付方式字段",
						key: keyhead + '_PAYMENT_TYPE'
					}, {
						title: "收货街道字段",
						key: keyhead + '_DELIVERY_SUBURB'
					}, {
						title: "收货人手机字段",
						key: keyhead + '_DELIVERY_MOBILE'
					}, {
						title: "收货人详细地址1字段",
						key: keyhead + '_DELIVERY_STREET_ADDRESS_1'
					}, {
						title: "订单备注字段",
						key: keyhead + '_ORDER_COMMENT'
					}, {
						title: "订单项字段",
						key: keyhead + '_ORDER_LINEITEMS'
					}, {
						title: "订单项数量字段",
						key: keyhead + '_ITEM_QTY'
					}, {
						title: "订单项产品sku字段",
						key: keyhead + '_PRODUCT_SKU'
					}, {
						title: "订单状态映射",
						key: keyhead + '_ORDER_STATUS_MAPPING'
					}, {
						title: "付款时间字段",
						key: keyhead + '_ORDER_PAID_DATE'
					}, {
						title: "下单时间字段",
						key: keyhead + '_ORDER_DATE_PURCHASED'
					},{
                        title: "时间格式",
                        key: keyhead + "_DATE_FORMAT"
                    },{
                        title: "国家",
                        key: keyhead + '_DELIVERY_COUNTRY'
                    },{
                        title: "名",
                        key: keyhead + '_DELIVERY_FIRSTNAME'
                    },{
                        title: "姓",
                        key: keyhead + '_DELIVERY_LASTNAME'
                    },{
                        title: "邮箱",
                        key: keyhead + '_DELIVERY_EMAIL'
                    },{
                        title: "配送方式",
                        key: keyhead + '_SHIPPING_CODE'
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
		me.bbar = bbar,
			me.callParent(arguments);
	}
});

/*                    //store中拥有的标签name
                    var mystorearray = []; 
                    for(var a =0; a<records.length;a++){
                    	mystorearray.push(records[a].get('title'));
                    };
                    //交集后的差集，为要添加的空标签
                    let intersection = mystorearray.filter(v => myLabel.includes(v));
                    let difference = myLabel.concat(intersection).filter(v => !myLabel.includes(v) || !intersection.includes(v));
                       //添加store中有的
                        for(var i = 0;i<records.length;i++){
                            var fieldtext= new Ext.form.field.Text({
                                fieldLabel: records[i].get('title'),
                                //allowBlank: false,
                                width:350,
                                blankText:'this value is required',
                                value: records[i].get('value'),
                                name: records[i].get('id'),
                                itemId: i
                            });
                            page.add(fieldtext);
                         };
                        //添加store中没有的
	                        for(var j = 0;j<difference.length;j++){
	                            var fieldtext= new Ext.form.field.Text({
	                                fieldLabel: difference[j],
	                                width:350,
	                                blankText:'this value is required',
	                                itemId: Number(records.length+j)
	                            });
	                            page.add(fieldtext);
	                         }*/