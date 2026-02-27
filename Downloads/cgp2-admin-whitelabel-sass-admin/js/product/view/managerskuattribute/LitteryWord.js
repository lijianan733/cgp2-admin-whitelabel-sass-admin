Ext.onReady(function (){
    function managerSkuAttribute(id) {

        var skuAttributeGrid = createAttributeGrid(adminPath + 'api/products/configurable/' + id + '/skuAttributes', {
            tbar: [{
                xtype: 'button',
                text: i18n.getKey('add'),
                handler: addSkuAttribute
            }],
            viewConfig: {
                enableTextSelection: true
            },
            columns: [{
                xtype: 'actioncolumn',
                width: 50,
                items: [{
                    iconCls: 'icon_remove icon_margin',
                    tooltip: 'Remove',
                    isDisabled: false,
                    handler: function (view, colIndex, rowIndex, item, e, record, row) {
                        removeSkuAttribute(record.get('id'), id,record.get('inputType'));
                    }
                }]
            }]
        });

        createSkuProductGrid(skuAttributeGrid.getStore());


        var window = new Ext.window.Window({
            title: i18n.getKey('managerSkuAttr'),
            modal : true,
            layout: {
                type: 'vbox',
                align: 'stretch',
                padding: 5
            },
            defaults: {
                flex: 1
            },
            width: 850,
            height: 450,
            items: [skuAttributeGrid]
        });

        window.show();

        //检查该产品下的SkuProduct有该属性的Sku多少种
        function removeSkuAttribute(attributeId, productId,inputType) {

            //获得目前拥有的已经使用的options
            var request = {
                method: 'GET',
                url: adminPath + 'api/products/configurable/' + productId + '/' + attributeId + '/options?access_token=' + Ext.util.Cookies.get('token'),
                success: function (response) {
                    var resp = Ext.JSON.decode(response.responseText);
                    var options = resp.data;
                    var optionValue;
                    if (options.length <= 1) {
                        if (options.length == 1){
                            optionValue = options[0].optionIds;
                        }
                        else{
                            optionValue = "";
                        }
                        Ext.Ajax.request({
                            method: 'PUT',
                            url: adminPath + 'api/products/configurable/' + productId + '/' + attributeId + '/options?access_token=' + Ext.util.Cookies.get('token') + '&option=' + optionValue,
                            success: function (response, options) {
                                var resp = Ext.JSON.decode(response.responseText);
                                if (resp.success) {
                                    var store = skuAttributeGrid.getStore();
                                    store.remove(store.getById(attributeId));
                                    skuProductGrid.getStore().load();
                                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('removeskuattrsu') + '!');
                                }else{
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                                }
                            },
                            failure: function (resp, options) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        });

                        return;

                    }

                    //生成raidos
                    var items = [];
                    Ext.Array.each(options, function (option) {
                        var item = {
                            boxLabel: option.value,
                            name: 'option',
                            inputValue: option.optionIds
                        };
                        items.push(item);
                    })


                    var optionForm = new Ext.form.Panel({
                        region: 'center',
                        items: [{
                            xtype: 'radiogroup',
                            fieldLabel: 'Options',
                            itemId: 'radiogroup',
                            defaults: {
                                flex: 1
                            },
                            layout: 'hbox',
                            items: items
                        }],
                        tbar: [{
                            xtype: 'button',
                            text: 'save',
                            handler: saveSelectOption
                        }]
                    });

                    var window = new Ext.window.Window({
                        title: i18n.getKey('options'),
                        layout: 'border',
                        width: 600,
                        height: 400,
                        items: [optionForm]
                    });

                    window.show();
                    //保留选中的option
                    function saveSelectOption() {
                        var radiogroup = this.ownerCt.ownerCt.getComponent('radiogroup');
                        var option = radiogroup.getValue().option;

                        Ext.Ajax.request({
                            method: 'PUT',
                            url: adminPath + 'api/products/configurable/' + productId + '/' + attributeId + '/options?access_token=' + Ext.util.Cookies.get('token') + '&option=' + option,
                            success: function (response, options) {
                                var resp = Ext.JSON.decode(response.responseText);
                                if (resp.success) {
                                    var store = skuAttributeGrid.getStore();
                                    store.remove(store.getById(attributeId));
                                    skuProductGrid.getStore().load();
                                    window.close();
                                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('removeskuattrsu') + "!");
                                }else{
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                                }
                            },
                            failure: function (resp, options) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        });

                    }
                },
                failure: function (resp, options) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            }
            if(Ext.Array.contains(['DropList','CheckBox','RadioButtons','Color'],inputType)){
                Ext.Ajax.request(request);
            }else{
                Ext.Ajax.request({
                    method: 'PUT',
                    url: adminPath + 'api/products/configurable/' + productId + '/' + attributeId + '/options?access_token=' + Ext.util.Cookies.get('token') + '&option=null',
                    success: function (response, options) {
                        var resp = Ext.JSON.decode(response.responseText);
                        if (resp.success) {
                            var store = skuAttributeGrid.getStore();
                            store.remove(store.getById(attributeId));
                            skuProductGrid.getStore().load();
                            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('removeskuattrsu') + '!');
                        }else{
                            Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                        }
                    },
                    failure: function (resp, options) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            }

        }


        /**
         *增加Sku属性  从已有的一般属性中添加,需要为optional的属性
         */
        function addSkuAttribute() {
            var productId = id;
            var skuProductGrid;
            var generalAttributeGrid = createAttributeGrid(adminPath + 'api/products/configurable/' + id + '/generalAttributes?optional=false', {
                region: 'center',
                multiSelect: true,
                selType: 'checkboxmodel',
                bbar: ["->",{
                    xtype: 'button',
                    text: i18n.getKey('ok'),
                    handler: submitAdd
                },{
                    text : i18n.getKey('cancel'),
                    handler : function(btn){
                        btn.ownerCt.ownerCt.ownerCt.close();
                    }
                }]
            });
            var window = new Ext.window.Window({
                title: i18n.getKey('addAttribute'),
                modal : true,
                width: 800,
                height: 600,
                layout: 'border',
                items: [generalAttributeGrid]
            });

            window.show();
            /**
             *提交增加的skuAttribute
             *
             */
            function submitAdd() {
                var grid = this.ownerCt.ownerCt;
                var attributes = grid.getSelectionModel().getSelection();
                var attributeIds = [];
                Ext.Array.each(attributes, function (attribute) {
                    attributeIds.push(attribute.get('id'));
                });
                if(Ext.isEmpty(attributeIds)){
                    Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('pleaseSelectAttribute'));
                    return;
                }

                Ext.Ajax.request({
                    url: adminPath + 'api/products/configurable/' + id + '/skuAttributes',
                    method: 'POST',
                    params: {
                        attributeIds: attributeIds,
                        access_token: Ext.util.Cookies.get('token')
                    },
                    success: function (response, options) {

                        var resp = Ext.JSON.decode(response.responseText);
                        if (resp.success) {
                            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('addskuattrsuccess') + '!');
                            var store = skuAttributeGrid.getStore();

                            var datas = [];
                            Ext.Array.each(attributes, function (attribute) {
                                datas.push(attribute.data);
                            })
                            store.loadData(datas, true);
                            store.load();
                            grid.getStore().remove(attributes);
                            window.close();

                        }else{
                            Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                        }

                    },
                    failure: function (resp, options) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            }
        }

        function createAttributeGrid(url, gridConfig) {
            //sku attributes store
            var store = new Ext.data.Store({
                fields: [{
                    name: 'id',
                    type: 'int',
                    useNull: true
                }, 'code', 'name', 'inputType', {
                    name: 'options',
                    type: 'array'
                },{
                    name: 'displayName',
                    type: 'string'
                },{
                    name: 'skuAttributeId',
                    type: 'int',
                    useNull: true
                },{
                    name: 'description',
                    type: 'string'
                }],
                proxy: {
                    type: 'uxrest',
                    url: url,
                    reader: {
                        type: 'json',
                        root: 'data'
                    },
                    extraParams: {
                        access_token: Ext.util.Cookies.get('token')
                    }
                },
                autoLoad: true
            });



            var localGridConfig = {
                titile: 'Sku Attribute',
                store: store,
                columns: []
            };
            gridconfig = gridConfig || {};
            gridConfig = Ext.merge(localGridConfig, gridConfig);
            var basicColumns = [{
                xtype: 'componentcolumn',
                itemId: "modifyDisplayName",
                width: 90,
                sortable: false,
                renderer:function(value, metaData, record, rowIndex){
                    return new Ext.button.Button({
                        text: i18n.getKey('modify'),
                        itemId: 'reSend',
                        handler: function () {
                            Ext.create('Ext.window.Window',{
                                width: 500,
                                height: 170,
                                title: i18n.getKey('modify'),
                                modal: true,
                                layout: 'fit',
                                items:[{
                                    xtype: 'form',
                                    border: false,
                                    padding: '10px',
                                    items: [{
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('newDisplayName'),
                                        name: 'newDisplayName',
                                        width: 400,
                                        value: record.get('displayName'),
                                        itemId: 'newDisplayName',
                                        allowBlank: false
                                    },{
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('description'),
                                        name: 'description',
                                        value: record.get('description'),
                                        width: 400,
                                        itemId: 'description'
                                    }]
                                }],
                                bbar: ['->',{
                                    xtype: 'button',
                                    text: i18n.getKey('modify'),
                                    handler: function(){
                                        var win = this.ownerCt.ownerCt;
                                        var form = win.down('form');
                                        var a = record.get('skuAttributeId');
                                        if(form.isValid()) {
                                            var data = {};
                                            form.items.each(function(item){
                                                data[item.name] =  item.getValue();
                                            });
                                            Ext.Ajax.request({
                                                url: adminPath + 'api/products/configurable/'+id+'/skuAttributes/'+record.get('skuAttributeId'),
                                                method: 'PUT',
                                                jsonData: {'displayName': data.newDisplayName, 'description': data.description},
                                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                                success: function(res){
                                                    var response = Ext.JSON.decode(res.responseText);
                                                    if(response.success){
                                                        Ext.Msg.alert('提示','修改成功!',function close(){
                                                            store.load();
                                                            win.close();
                                                        })
                                                    }else{
                                                        Ext.Msg.alert('提示','修改失败:'+response.data.message)
                                                    }
                                                },
                                                failure: function(resp){
                                                    var response = Ext.JSON.decode(resp.responseText);
                                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                                }
                                            })
                                        }
                                    }
                                },{
                                    xtype: 'button',
                                    text: i18n.getKey('cancel'),
                                    handler: function(){
                                        this.ownerCt.ownerCt.close();
                                    }
                                }]
                            }).show();
                        }

                    });
                }
            },{
                dataIndex: 'skuAttributeId',
                width: 50,
                text: i18n.getKey('id')
            },{
                dataIndex: 'id',
                width: 120,
                text: i18n.getKey('attributeId')
            },{
                text: i18n.getKey('displayName'),
                dataIndex: 'displayName',
                itemId: 'displayName',
                renderer : function(value,metadata){
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },{
                text: i18n.getKey('description'),
                dataIndex: 'description',
                itemId: 'description',
                renderer : function(value,metadata){
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
                {
                    dataIndex: 'code',
                    text: i18n.getKey('code')
                }, {
                    dataIndex: 'name',
                    text: i18n.getKey('name')
                }, {
                    dataIndex: 'inputType',
                    text: i18n.getKey('inputType')
                }, {
                    text: i18n.getKey('options'),
                    dataIndex: 'options',
                    itemId: 'options',
                    width: 150,
                    renderer: function (value, metadata, record) {

                        var v = [];
                        Ext.Array.each(value, function (data) {
                            v.push(data.name);
                        })
                        //是颜色option 展示颜色块
                        if (record.get('inputType') == 'Color') {
                            var color = [];
                            Ext.Array.each(v, function (c) {

                                color.push(c.split(':')[0] + '<a class=colorpick style="background-color:' + c.split(':')[1] + '"></a>');

                            })
                            v = color;
                        }
                        v = v.join(',');
                        return v;
                    }
                }];

            gridConfig.columns = Ext.Array.merge(gridConfig.columns, basicColumns);

            var grid = new Ext.grid.Panel(gridConfig);

            return grid;
        }

        //根据SkuAttribute来生成对应的SkuProductGrid中的column
        function createSkuProductGrid(skuAttributeStore) {

            //创建SkuAttribute的column
            skuAttributeStore.load(function (skuAttributes, operation, success) {
                var skuAttributeColumns = [];
                skuAttributeColumns.push({
                    autoSizeColumn: 'false',
                    width: 50,
                    dataIndex: 'id',
                    text: i18n.getKey('id')
                });
                var skuAttributeIds = [];
                Ext.Array.each(skuAttributes, function (skuAttribute) {
                    var skuAttributeColumn = {};
                    skuAttributeIds.push(skuAttribute.get('id'));
                    skuAttributeColumn.text = skuAttribute.get('code');
                    skuAttributeColumn.renderer = function (value, metadata, record, rowIndex, colIndex, store, view) {
                        var value = [];
                        Ext.Array.each(record.data.attributeValues, function (attributeValue) {
                            if (Ext.Array.contains(skuAttributeIds, attributeValue['attributeId'])) {
                                var optionIds = attributeValue['optionIds'];
                                if(optionIds){
                                    Ext.Array.each(optionIds.split(','), function (optionId) {
                                        Ext.Array.findBy(skuAttribute.get('options'), function (option) {
                                            if (option['id'] == optionId) {
                                                value.push(option['name']);
                                            }
                                        })
                                    })
                                }else{
                                    if(attributeValue['attributeId'] == skuAttribute.get('id')){
                                        value.push(attributeValue['value']);
                                    }
                                }
                            }

                        });
                        return value.join(',');
                    };
                    skuAttributeColumns.push(skuAttributeColumn);

                });
                skuAttributeColumns.push({
                    autoSizeColumn: false,
                    width: 130,
                    dataIndex: 'sku',
                    text: 'SKU'
                });

                skuAttributeColumns.push({
                    dataIndex: 'salePrice',
                    text: i18n.getKey('salePrice')
                });

                skuAttributeColumns.push({
                    dataIndex: 'weight',
                    text: i18n.getKey('weight')
                });


                //create sku product grid
                var grid = new Ext.grid.Panel({
                    //                    region: 'south',
                    title: i18n.getKey('currentskuprod'),
                    store: new Ext.data.Store({
                        model: 'CGP.model.Product',
                        proxy: {
                            type: 'uxrest',
                            url: adminPath + 'api/products/configurable/' + id + '/skuProduct',
                            reader: {
                                type: 'json',
                                root: 'data'
                            }
                        },
                        autoLoad: true
                    }),
                    columns: {
                        items: skuAttributeColumns,
                        defaults: {
                            autoSizeColumn: true
                        }
                    },
                    viewConfig: {
                        enableTextSelection: true,
                        listeners: {
                            viewready: function (dataview) {
                                Ext.each(dataview.panel.headerCt.gridDataColumns, function (column) {
                                    if (column.autoSizeColumn === true)
                                        column.autoSize();
                                })
                            }
                        }
                    }
                })
                window.add(grid);
                skuProductGrid = grid;
            })
        }

    }
})

