/**
 * @author xiu
 * @date 2025/9/26
 */
Ext.define('CGP.producebufferdayssetting.controller.Controller', {
    compGather: [
        // 容器类
        'Ext.ux.form.field.CreateTitleItem',        //标题项
        'Ext.ux.form.field.CreateNextStepWindow',   //window下一步功能

        // 特殊数据类
        'Ext.ux.form.field.MinMaxField',            //范围输入框
        'Ext.ux.form.field.CreateChangeCombo',      //combo切换模板功能

        // 样式类
        'Ext.ux.form.field.CreateLoadingComp',      //拉取中组件

        // gridColumn类
        'Ext.ux.grid.column.DiyDateColumn',         //自动转时间格式      diy_date_column
        'Ext.ux.grid.column.ImageColumn',           //图片预览           imagecolumn
        'Ext.ux.grid.column.InputAndBtnColumn'      //表格内输入框和按钮   input_and_btn_column

    ],
    functionGather: [
        // 请求类
        'JSGetQuery(url,callBack,otherConfig)',                                        //GET请求
        'JSDeleteQuery(url,callBack,otherConfig)',                                     //Delete请求
        'JSAsyncEditQuery(url, jsonData, isEdit, callBack, hideMsg, otherConfig)',     //PUT/POST请求

        // 数据处理类
        'JSGetFilteredValues(filters, data)',                                          //搜索框数据格式过滤 (数组对象)
        'JSRecursiveSearch(data, entryKey, filterParams)',                             //搜索框数据格式过滤 (tree对象)
        'JSDeduplicateByKey(array, key, options = {deep,keep})',                       //对象去重

        // 信息传递类
        'JSPostIframeDataFn(data)',                                                    //向iframe外发送数据
        'JSGetIframeInfoFn(overMessage, callBack, overTime)',                          //接收iframe信息

        // 数据类
        'JSGetProductConfigAttribute(productId, attributeVersionId, isFilterSku)'      //获取product配置属性

    ],

    //获取url
    getUrl: function (author, params) {
        const id = params?.id;
        var urlGather = {
            mainUrl: 'api/colors',
            addPart: 'addPart',
            deletePart: 'deletePart',
            selectPart: 'selectPart' + id,
            deletePartGrid: 'deletePartGrid' + id
        }
        return adminPath + urlGather[author];
    },

    // 创建form窗口
    createFormWindow: function (data, callBack) {
        var controller = this,
            id = data?.id,
            isEdit = !!data;

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('xxxx'),
            width: 800,
            height: 400,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBlank: true
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = null,
                            items = me.items.items;
                        items.forEach(item => {
                            result = item.diyGetValue ? item.diyGetValue() : item.getValue()
                        })
                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;
                        items.forEach(item => {
                            var {name} = item;
                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                        })
                    },
                    items: [],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            suffixUrl = isEdit ? '' : 'api/smtManufactureCenterSelectConfigs',
                            url = adminPath + suffixUrl,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue(),
                            result = {};

                        if (form.isValid()) {
                            console.log(formData);
                            JSAsyncEditQuery(url, result, isEdit, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        callBack && callBack(responseText.data);
                                        win.close();
                                    }
                                }
                            })
                        }
                    }
                }
            },
        }).show();
    },

    // 创建grid窗口
    createGridWindow: function (store, callBack) {
        var controller = this
        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('xxxx'),
            width: 800,
            height: 400,
            items: [
                {
                    xtype: 'searchcontainer',
                    name: 'searchcontainer',
                    itemId: 'searchcontainer',
                    filterCfg: {
                        minHeight: 60,
                        layout: {
                            type: 'table',
                            columns: 3
                        },
                        defaults: {
                            isLike: false
                        },
                        /*searchActionHandler: function (btn) { //重写本地查询
                            var me = this,
                                form = me.ownerCt.ownerCt,
                                searchcontainer = form.ownerCt,
                                store = searchcontainer.grid.store,
                                filterData = form.getQuery()

                            if (filterData.length) {
                                store.proxy.data = controller.getFilteredValues(filterData, storeData);
                            } else {
                                store.proxy.data = storeData;
                            }
                            store.load();
                        },*/
                        items: [
                            {
                                xtype: 'textfield',
                                name: '_id',
                                itemId: 'id',
                                fieldLabel: i18n.getKey('id'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'name',
                                itemId: 'name',
                                fieldLabel: i18n.getKey('name'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'displayName',
                                fieldLabel: i18n.getKey('displayName'),
                                itemId: 'displayName'
                            },
                        ]
                    },
                    gridCfg: {
                        editAction: true,
                        deleteAction: true,
                        store: store,
                        columnDefaults: {
                            tdCls: 'vertical-middle',
                            align: 'center',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip ="' + value + '"';
                                return value
                            }
                        },
                        editActionHandler: function (grid, rowIndex, colIndex) {

                        },
                        deleteActionHandler: function (view, colInde, rowInde, el, event, record, dom) {

                        },
                        tbar: [
                            {
                                text: i18n.getKey('add'),
                                iconCls: 'icon_add',
                                handler: function (btn) {

                                }
                            },
                            {
                                text: i18n.getKey('delete'),
                                iconCls: 'icon_delete',
                                handler: function (btn) {

                                }
                            }
                        ],
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: '_id',
                                width: 180,
                                tdCls: 'vertical-middle',
                                itemId: 'id',
                                sortable: true
                            },
                            {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                width: 180,
                                itemId: 'name',
                            },
                            {
                                text: i18n.getKey('displayName'),
                                dataIndex: 'displayName',
                                flex: 1,
                                itemId: 'displayName',
                            },
                        ]
                    }
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            suffixUrl = 'api/smtManufactureCenterSelectConfigs',
                            url = adminPath + suffixUrl,
                            searchcontainer = win.getComponent('searchcontainer'),
                            selected = searchcontainer.grid.getSelectionModel().getSelection(),
                            result = {};

                        if (selected?.length) {
                            JSAsyncEditQuery(url, result, false, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        callBack && callBack(responseText.data);
                                        win.close();
                                    }
                                }
                            })
                        } else {
                            Ext.Msg.alert('提示', '请至少选择一条数据!')
                        }
                    }
                }
            },
        }).show();
    },

    // 转换数据格式
    changeSetDataFormat: function (data) {
        var {daySpace, qtySpace} = data,
            {maxDay, minDay} = daySpace,
            {qtyFrom, qtyTo} = qtySpace,
            id = data['id'] || JSGetUUID();

        return {
            id,
            minDay,
            maxDay,
            qtyFrom,
            qtyTo,
        }
    },

    // 创建产品缓冲天数设置窗口
    createProduceBufferDaysSettingFormWindow: function (data, store, callBack) {
        var controller = this,
            isEdit = !!data?.id,
            editText = isEdit ? '编辑' : '新建',
            {qtyFrom,minDay} = controller.getStoreMaxValue(store, isEdit);
        
        return qtyFrom && Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey(`${editText}_产品缓冲天数配置`),
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBlank: true
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;

                        items.forEach(item => {
                            var name = item['name'];
                            result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
                        })

                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;
                        items.forEach(item => {
                            var {name} = item;
                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                        })
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'id',
                            itemId: 'id',
                            hidden: true,
                            fieldLabel: i18n.getKey('id'),
                        },
                        {
                            xtype: 'minmaxfield',
                            name: 'qtySpace',
                            itemId: 'qtySpace',
                            fieldLabel: i18n.getKey('订单项项数区间'),
                            isEnable: false,
                            minConfig: {
                                name: 'qtyFrom',
                                minValue: 1,
                                decimalPrecision: 0,
                                listeners: {
                                    afterrender: function (field) {
                                        field.setValue(qtyFrom);
                                    },
                                    change: function (field, newValue, oldValue) {
                                        var container = field.ownerCt,
                                            max = container.getComponent('max');

                                        max.setDisabled(!newValue);
                                        max.setMinValue(newValue);
                                        max.setValue(null);
                                    }
                                }
                            },
                            maxConfig: {
                                name: 'qtyTo',
                                decimalPrecision: 0,
                                allowBlank: true,
                                diySetValue: function (data) {
                                    var me = this;
                                    if (data) {
                                        me.setValue(data);
                                    }
                                },
                            }
                        },
                        {
                            xtype: 'minmaxfield',
                            name: 'daySpace',
                            itemId: 'daySpace',
                            fieldLabel: i18n.getKey('生产天数区间'),
                            isEnable: false,
                            minConfig: {
                                name: 'minDay',
                                minValue: 1,
                                decimalPrecision: 0,
                                listeners: {
                                    afterrender: function (field) {
                                        field.setValue(minDay);
                                    },
                                    change: function (field, newValue, oldValue) {
                                        var container = field.ownerCt,
                                            max = container.getComponent('max');

                                        max.setDisabled(!newValue);
                                        max.setMinValue(newValue);
                                        max.setValue(null);
                                    }
                                }
                            },
                            maxConfig: {
                                name: 'maxDay',
                                allowBlank: true,
                                decimalPrecision: 0,
                                diySetValue: function (data) {
                                    var me = this;
                                    if (data) {
                                        me.setValue(data);
                                    }
                                },
                            }
                        },
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            if (data) {
                                var {qtyFrom, qtyTo, minDay, maxDay, id} = data,
                                    result = {
                                        id: id,
                                        qtySpace: {
                                            qtyFrom: qtyFrom,
                                            qtyTo: qtyTo,
                                        },
                                        daySpace: {
                                            minDay: minDay,
                                            maxDay: maxDay,
                                        }
                                    }

                                comp.diySetValue(result);
                            }
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue(),
                            result = controller.changeSetDataFormat(formData);

                        if (form.isValid()) {
                            callBack && callBack(result);
                            win.close();
                        }
                    }
                }
            },
        }).show();
    },

    //创建描述配置
    createSystemDefaultProductDaysConfigFormWindow: function (data, callBack) {
        var controller = this;

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey(`编辑_系统默认生产天数`),
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBlank: true
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;

                        items.forEach(item => {
                            var name = item['name'];
                            result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
                        })

                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;
                        items.forEach(item => {
                            var {name} = item;
                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                        })
                    },
                    items: [
                        {
                            xtype: 'textarea',
                            name: 'description',
                            itemId: 'description',
                            labelWidth: 50,
                            height: 80,
                            width: 300,
                            fieldLabel: i18n.getKey('描述'),
                        },
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            if (data) {
                                comp.diySetValue(data);
                            }
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue();

                        if (form.isValid()) {
                            callBack && callBack(formData);
                            win.close();
                        }
                    }
                }
            },
        }).show();
    },

    //获取store中的最大值
    getStoreMaxValue: function (store, isEdit) {
        var data = store?.proxy.data,
            qtyFromResult = 1,
            minDayResult = 1;

        // 修改的状态不进入计算
        if (!isEdit && data?.length) {
            var endValue = data[data.length - 1],
                {qtyTo, maxDay} = endValue;

            minDayResult = +maxDay + 1;
            if (qtyTo) {
                qtyFromResult = +qtyTo + 1;
            } else {
                Ext.Msg.alert('提示', '请完善最后一项的项数最大值!');
                return false
            }
        }

        return {
            qtyFrom: qtyFromResult,
            minDay: minDayResult
        };
    },


    //获取生产缓冲天数配置数据
    getProduceBufferDaysSettingData: function () {
        var url = adminPath + 'api/produceBufferDaysSetting?page=1&limit=10000',
            queryData = JSGetQuery(url)[0],
            /*queryData = {
                _id: '123456',
                clazz: "com.qpp.cgp.domain.produce.ProduceBufferDaysSetting",
                description: 'producebufferdayssetting',
                table: [
                    {
                        id: '123',
                        qtyTo: 5,
                        qtyFrom: 1,
                        minDay: 1,
                        maxDay: 3,
                    },
                    {
                        id: '1234',
                        qtyTo: 15,
                        qtyFrom: 6,
                        minDay: 5,
                        maxDay: 6,
                    },
                    /!*{
                        id: '12345',
                        qtyFrom: 16,
                        minDay: 7,
                    }*!/
                ]
            },*/
            table = queryData?.table?.map(item => {
                item['id'] = JSGetUUID();
                return item;
            });

        if (!queryData) {
            var postJson = {
                clazz: "com.qpp.cgp.domain.produce.ProduceBufferDaysSetting",
                description: 'producebufferdayssetting',
                table: []
            }

            JSAjaxRequest(url, 'POST', false, postJson, false, function (require, success, response) {
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        queryData = responseText?.data?.content || responseText?.data;
                    }
                }
            }, false);
            console.log('创建配置!')
        } else {
            queryData['table'] = table;
        }

        return queryData;
    }
})