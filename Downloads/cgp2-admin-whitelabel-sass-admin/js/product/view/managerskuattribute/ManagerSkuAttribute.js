Ext.syncRequire('CGP.product.model.Product');
Ext.onReady(function () {
    var controller = Ext.create('CGP.product.view.managerskuattribute.controller.Controller');

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var id = getQueryString('id');
    var skuAttributeGrid = createAttributeGrid(adminPath + 'api/products/configurable/' + id + '/skuAttributes', {
        title: i18n.getKey('skuAttribute'),
        tbar: [{
            xtype: 'button',
            text: i18n.getKey('add'),
            iconCls: 'icon_create',
            handler: addSkuAttribute
        }, {
            xtype: 'button',
            text: i18n.getKey('refresh'),
            iconCls: 'icon_reset',
            handler: function (button) {
                var store = button.ownerCt.ownerCt.getStore();
                store.load();
            }
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
                    removeSkuAttribute(record.get('attribute').id, id, record.get('inputType'), record.get('id'));
                }
            }]
        }]
    }, true);

    createSkuProductGrid(skuAttributeGrid.getStore());
    var tab = Ext.create('Ext.tab.Panel', {
        region: 'center',
        items: [skuAttributeGrid],
        listeners: {
            tabchange: function (comp, newtab, oldtab) {
                if (newtab.itemId == 'skuProductGrid') {
                    newtab.getStore().load();
                }
            }
        }
    });
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [tab]
    });

    /*var window = new Ext.window.Window({
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

    window.show();*/

    //检查该产品下的SkuProduct有该属性的Sku多少种
    function removeSkuAttribute(attributeId, productId, inputType, skuAttributeId) {

        //获得目前拥有的已经使用的options
        var request = {
            method: 'GET',
            url: adminPath + 'api/products/configurable/' + productId + '/' + attributeId + '/options?access_token=' + Ext.util.Cookies.get('token'),
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText);
                var options = resp.data;
                var optionValue;
                if (options.length <= 1) {
                    if (options.length == 1) {
                        optionValue = options[0].optionIds;
                    } else {
                        optionValue = "";
                    }
                    Ext.Ajax.request({
                        method: 'PUT',
                        url: adminPath + 'api/products/configurable/' + productId + '/' + attributeId + '/options?access_token=' + Ext.util.Cookies.get('token') + '&option=' + optionValue,
                        success: function (response, options) {
                            var resp = Ext.JSON.decode(response.responseText);
                            if (resp.success) {
                                var store = skuAttributeGrid.getStore();
                                store.remove(store.getById(skuAttributeId));
                                skuProductGrid.getStore().load();
                                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('removeskuattrsu') + '!');
                            } else {
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
                                store.remove(store.getById(skuAttributeId));
                                skuProductGrid.getStore().load();
                                window.close();
                                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('removeskuattrsu') + "!");
                            } else {
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
        if (Ext.Array.contains(['DropList', 'CheckBox', 'RadioButtons', 'Color'], inputType)) {
            Ext.Ajax.request(request);
        } else {
            Ext.Ajax.request({
                method: 'PUT',
                url: adminPath + 'api/products/configurable/' + productId + '/' + attributeId + '/options?access_token=' + Ext.util.Cookies.get('token') + '&option=null',
                success: function (response, options) {
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                        var store = skuAttributeGrid.getStore();
                        store.remove(store.getById(skuAttributeId));
                        skuProductGrid.getStore().load();
                        Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('removeskuattrsu') + '!');
                    } else {
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
            bbar: ["->", {
                xtype: 'button',
                text: i18n.getKey('ok'),
                handler: submitAdd
            }, {
                text: i18n.getKey('cancel'),
                handler: function (btn) {
                    btn.ownerCt.ownerCt.ownerCt.close();
                }
            }]
        }, false);
        var window = new Ext.window.Window({
            title: i18n.getKey('addAttribute'),
            modal: true,
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
            if (Ext.isEmpty(attributeIds)) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('pleaseSelectAttribute'));
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
                        //Ext.getCmp('skuProductGrid').getStore().load();
                        grid.getStore().remove(attributes);
                        window.close();

                    } else {
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

    function createAttributeGrid(url, gridConfig, isSku) {
        //sku attributes store
        var store = new Ext.data.Store({
            fields: [{
                name: 'id',
                type: 'int',
                useNull: true
            }, 'code', 'name', 'inputType', {
                name: 'options',
                type: 'array'
            }, {
                name: 'displayName',
                type: 'string'
            }, {
                name: 'description',
                type: 'string'
            }, {
                name: 'sortOrder',
                type: 'int'
            }, {
                name: 'attribute',
                type: 'object'
            }, {
                name: 'hidden',
                type: 'boolean'
            }, {
                name: 'enable',
                type: 'boolean'
            }, {
                name: 'required',
                type: 'boolean'
            }],
            proxy: {
                type: 'uxrest',
                url: url,
                reader: {
                    type: 'json',
                    root: 'data'
                },
                sorters: [{
                    property: 'sortOrder',
                    direction: 'ASC'
                }],
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
        var basicColumns = [
            {
                xtype: 'componentcolumn',
                itemId: "modifyDisplayName",
                width: 90,
                sortable: false,
                renderer: function (value, metaData, record, rowIndex) {
                    return new Ext.button.Button({
                        text: i18n.getKey('modify'),
                        itemId: 'reSend',
                        hidden: !isSku,
                        cls: 'x-btn-default-toolbar-small',
                        /*style: {
                            background: 'rgb(245, 245, 245)'
                        },*/
                        handler: function () {
                            Ext.create('Ext.window.Window', {
                                width: 500,
                                height: 370,
                                title: i18n.getKey('modify'),
                                modal: true,
                                layout: 'fit',
                                items: [{
                                    xtype: 'form',
                                    border: false,
                                    padding: '10px',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: i18n.getKey('newDisplayName'),
                                            name: 'newDisplayName',
                                            width: 450,
                                            value: record.get('displayName'),
                                            itemId: 'newDisplayName',
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'numberfield',
                                            fieldLabel: i18n.getKey('sortOrder'),
                                            name: 'sortOrder',
                                            width: 450,
                                            minValue: 0,
                                            value: record.get('sortOrder'),
                                            itemId: 'sortOrder',
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'textarea',
                                            fieldLabel: i18n.getKey('description'),
                                            name: 'description',
                                            height: 200,
                                            value: record.get('description'),
                                            width: 450,
                                            itemId: 'description'
                                        }]
                                }],
                                bbar: ['->', {
                                    xtype: 'button',
                                    text: i18n.getKey('modify'),
                                    handler: function () {
                                        var win = this.ownerCt.ownerCt;
                                        var form = win.down('form');
                                        var a = record.get('skuAttributeId');
                                        if (form.isValid()) {
                                            var data = {};
                                            form.items.each(function (item) {
                                                data[item.name] = item.getValue();
                                            });
                                            Ext.Ajax.request({
                                                url: adminPath + 'api/products/configurable/' + id + '/skuAttributes/' + record.get('id'),
                                                method: 'PUT',
                                                jsonData: {
                                                    'displayName': data.newDisplayName,
                                                    'description': data.description,
                                                    'sortOrder': data.sortOrder
                                                },
                                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                                success: function (res) {
                                                    var response = Ext.JSON.decode(res.responseText);
                                                    if (response.success) {
                                                        Ext.Msg.alert('提示', '修改成功!', function close() {
                                                            store.load();
                                                            win.close();
                                                        })
                                                    } else {
                                                        Ext.Msg.alert('提示', '修改失败:' + response.data.message)
                                                    }
                                                },
                                                failure: function (resp) {
                                                    var response = Ext.JSON.decode(resp.responseText);
                                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                                }
                                            })
                                        }
                                    }
                                }, {
                                    xtype: 'button',
                                    text: i18n.getKey('cancel'),
                                    handler: function () {
                                        this.ownerCt.ownerCt.close();
                                    }
                                }]
                            }).show();
                        }

                    });
                }
            },
            {
                xtype: 'componentcolumn',
                itemId: "managerSkuAttriConstraint",
                width: 150,
                sortable: false,
                renderer: function (value, metaData, record, rowIndex) {
                    return new Ext.button.Button({
                        text: i18n.getKey('managerSkuAttriConstraint'),
                        itemId: 'managerButton',
                        cls: 'x-btn-default-toolbar-small',
                        hidden: !isSku,
                        handler: function () {
                            var skuAttributeId = record.getId();
                            var store = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeConstraint', {
                                skuAttributeId: skuAttributeId
                            });
                            controller.managerSkuAttriConstraint(tab, skuAttributeId, id, store);
                        }

                    });
                }
            },
            {
                dataIndex: 'id',
                width: 80,
                text: i18n.getKey('id')
            },
            {
                dataIndex: 'attribute',
                width: 80,
                xtype: "componentcolumn",
                text: i18n.getKey('attributeId'),
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + i18n.getKey('check') + i18n.getKey('attribute') + '"';
                    if (value) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + value.id + '</a>',
                            listeners: {
                                render: function (display) {
                                    display.getEl().on("click", function () {
                                        JSOpen({
                                            id: 'attributepage',
                                            url: path + 'partials/attribute/attribute.html?attributeId=' + value.id,
                                            title: i18n.getKey('attribute'),
                                            refresh: true
                                        });
                                    });
                                }
                            }
                        };
                    } else {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + '' + '</a>'
                        };
                    }


                }
            },
            {
                text: i18n.getKey('displayName'),
                dataIndex: 'displayName',
                itemId: 'displayName',
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('required'),
                dataIndex: 'required'
            },
            {
                text: i18n.getKey('enable'),
                dataIndex: 'enable'
            },
            {
                text: i18n.getKey('hidden'),
                dataIndex: 'hidden'
            },
            {
                dataIndex: 'code',
                text: i18n.getKey('code'),
                renderer: function (value, metadata, record) {
                    if (isSku) {
                        return record.get('attribute').code;
                    } else {
                        return value;
                    }
                }
            },
            {
                dataIndex: 'name',
                text: i18n.getKey('name'),
                renderer: function (value, metadata, record) {
                    if (isSku) {
                        return record.get('attribute').name;
                    } else {
                        return value;
                    }
                }
            },
            {
                dataIndex: 'inputType',
                text: i18n.getKey('inputType'),
                renderer: function (value, metadata, record) {
                    if (isSku) {
                        return record.get('attribute').inputType;
                    } else {
                        return value;
                    }
                }
            },
            {
                dataIndex: 'sortOrder',
                text: i18n.getKey('sortOrder')
            },
            {
                text: i18n.getKey('options'),
                dataIndex: 'options',
                itemId: 'options',
                width: 150,
                renderer: function (value, metadata, record) {
                    if (isSku) {
                        value = record.get('attribute').options;
                    }
                    var v = [];
                    Ext.Array.each(value, function (data) {
                        v.push(data.name);
                    })
                    //是颜色option 展示颜色块
                    if (record.get('attribute').inputType == 'Color') {
                        var color = [];
                        Ext.Array.each(v, function (c) {

                            color.push(c.split(':')[0] + '<a class=colorpick style="background-color:' + c.split(':')[1] + '"></a>');

                        })
                        v = color;
                    }
                    v = v.join(',');
                    return v;
                }
            },
            {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                width: 250,
                itemId: 'description',
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
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
                skuAttributeIds.push(skuAttribute.get('attribute').id);
                skuAttributeColumn.text = skuAttribute.get('attribute').code;
                skuAttributeColumn.renderer = function (value, metadata, record, rowIndex, colIndex, store, view) {
                    var value = [];
                    Ext.Array.each(record.data.attributeValues, function (attributeValue) {
                        if (Ext.Array.contains(skuAttributeIds, attributeValue['attributeId'])) {
                            var optionIds = attributeValue['optionIds'];
                            if (optionIds) {
                                Ext.Array.each(optionIds.split(','), function (optionId) {
                                    Ext.Array.findBy(skuAttribute.get('attribute').options, function (option) {
                                        if (option['id'] == optionId) {
                                            value.push(option['name']);
                                        }
                                    })
                                })
                            } else {
                                if (attributeValue['attributeId'] == skuAttribute.get('attribute').id) {
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
                itemId: 'skuProductGrid',
                store: new Ext.data.Store({
                    //fields: [{name: 'id',type:'int',useNull: true}],
                    model: 'CGP.product.model.Product',
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
            });
            tab.add(grid);
            skuProductGrid = grid;
        })
    }

});