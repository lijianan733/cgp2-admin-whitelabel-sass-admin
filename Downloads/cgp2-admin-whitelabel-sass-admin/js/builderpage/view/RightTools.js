/**
 * @author xiu
 * @date 2023/9/21
 */
Ext.Loader.syncRequire([
    'CGP.builderpage.store.MaterialStore',
    'CGP.builderrandomcardpage.store.MaterialStore'
])
Ext.define('CGP.builderpage.view.RightTools', {
    extend: 'Ext.form.Panel',
    alias: 'widget.rightTools',
    layout: {
        type: 'table',
        columns: 5
    },
    minWidth: 300,
    border: false,
    margin: '10 0 0 10',
    defaults: {
        margin: '0 20 0 0',
        width: 200
    },
    simpleResult: null,
    completeResult: null,
    parentComp: null,
    orderItemId: null,
    diyGetValue: function () {
        const me = this,
            controller = Ext.create('CGP.builderpage.controller.Controller'),
            showBleedPattern = me.getComponent('showBleedPattern'),
            viewType = me.getComponent('viewType'),
            isVisible = showBleedPattern.getValue(),
            selectObject = viewType.getArrayValue(),
            selectMaterialCode = selectObject?.materialCode,
            selectMaterialPath = selectObject?.materialPath,
            selectIdProperty = selectObject?.idProperty,
            comboStore = viewType.store.data.items,
            viewIds = [];

        // 找到选中的选项code 拿到其materialViews
        comboStore.forEach(item => {
            const {data} = item,
                {materialCode, materialViews, materialPath, idProperty} = data;

            if (selectIdProperty === idProperty) {
                materialViews.forEach(viewItem => {
                    const {_id, name} = viewItem;
                    viewIds.push({_id, name});
                })
            }
        })

        return controller.rightToolsFun(isVisible, viewIds);
    },
    initComponent: function () {
        const me = this,
            {parentComp, orderItemId, productInstanceId, isRandomCardPage} = me,
            evenType = 'render',
            controller = Ext.create('CGP.builderpage.controller.Controller'),
            storeName = isRandomCardPage ? 'CGP.builderrandomcardpage.store.MaterialStore' : 'CGP.builderpage.store.MaterialStore',
            store = Ext.create(storeName, {
                /* id: orderItemId,
                 type: 'orderItemsV2' //productInstances*/
                id: productInstanceId,
                type: 'productInstances',
                listeners: {
                    load: function (store) {
                        if (isRandomCardPage){
                            store.filterBy(function (record, id) {
                                var designMethod = record.get('designMethod');

                                return designMethod === 'FIX';
                            })
                        }
                    }
                },
            }),
            isDeliverInfo = JSGetQueryString('isDeliverInfo') === 'true',
            previewQtyData = [
                {
                    display: '自适应',
                    value: 0,
                },
                {
                    display: 2,
                    value: 2,
                },
                {
                    display: 4,
                    value: 4,
                },
                {
                    display: 6,
                    value: 6,
                },
                {
                    display: 8,
                    value: 8,
                },
                {
                    display: 10,
                    value: 10,
                }
            ];

        me.items = [
            {
                xtype: 'checkboxfield',
                boxLabel: '只显示出血线的图案',
                width: 200,
                colspan: 2,
                name: 'showBleedPattern',
                itemId: 'showBleedPattern',
                inputValue: 'showBleedPattern',
                margin: '0 30 0 20',
                listeners: {
                    change: function (comp, newValue) {
                        const evenType = 'update';
                        parentComp.loadPage(evenType, {
                            nameArray: ['isClip']
                        });
                    }
                }
            },
            {
                xtype: 'button',
                itemId: 'refresh',
                componentCls: "btnOnlyIcon",
                width: 70,
                colspan: 1,
                iconCls: 'icon_refresh',
                text: JSCreateFont('#000', false, '刷新', 12, false),
                load: function (btn) {
                    var result = [],
                        me = btn.ownerCt,
                        viewType = me.getComponent('viewType'),
                        selectObject = viewType.getArrayValue(),
                        selectMaterialCode = selectObject?.materialCode,
                        idProperty = selectObject?.idProperty

                    // 刷新需要调一次change并刷新viewType的store
                    me.dealInitData(viewType.store, idProperty);
                    var previewMode = me.getComponent('previewMode').getValue();
                    me.initPreviewPage(evenType, previewMode.previewMode);
                },
                handler: function (btn) {
                    var result = [];
                    const me = btn.ownerCt,
                        viewType = me.getComponent('viewType'),
                        selectObject = viewType.getArrayValue(),
                        idProperty = selectObject?.idProperty,
                        selectMaterialCode = selectObject?.materialCode;

                    viewType.store.load(function () {
                        // 刷新需要调一次change并刷新viewType的store
                        me.dealInitData(viewType.store, idProperty);
                        var previewMode = me.getComponent('previewMode').getValue();
                        me.initPreviewPage('redraw', previewMode.previewMode);
                    });
                },
                listeners: {
                    afterrender: function (comp) {
                        window.addEventListener('resize', JSCreateDebounce(function () {
                            comp.load(comp);
                        }, 1500, false));
                    }
                }
            },
            {
                xtype: 'gridcombo', // 使用gridcombo 是因为物料的唯一判断为 code+物料路径 需展示code 与 物料路径
                name: 'viewType',
                itemId: 'viewType',
                valueField: 'materialPath',
                displayField: 'materialName',
                lastQuery: '',
                colspan: 2,
                isFirstSelect: true, //杜绝第一次捕获变更
                editable: false,
                allowBlank: false,
                multiSelect: false,
                matchFieldWidth: false,
                store: store,
                filterCfg: {
                    hidden: true,
                },
                autoScroll: true,
                gridCfg: {
                    store: store,
                    autoScroll: true,
                    width: 500,
                    minHeight: 200,
                    maxHeight: 300,
                    columns: [
                        {
                            xtype: 'rownumberer',
                            align: 'center',
                            width: 70
                        },
                        {
                            text: i18n.getKey('物料名称'),
                            dataIndex: 'materialName',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip ="' + value + '"';
                                return value
                            }
                        },
                        {
                            text: i18n.getKey('物料路径'),
                            dataIndex: 'materialPath',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip ="' + value + '"';
                                return value
                            }
                        },
                    ]
                },
                listeners: {
                    afterrender: function (comp) {
                        store.on('load', () => {
                            if (comp.isFirstSelect) {
                                comp.isFirstSelect = false;
                            }
                            // comp.select(store.getAt(0));
                            comp.setValue(store.getAt(0)?.data)
                        })
                    },
                    change: function (comp, newValue) {
                        if (!comp.isFirstSelect) { //杜绝第一次捕获变更
                            // 不在多次生成监听
                            comp.isFirstSelect = true;

                            comp.on('change', function (comp) {
                                var newValue = comp.getArrayValue(),
                                    idProperty = newValue?.idProperty,
                                    materialCode = newValue.materialCode,
                                    previewMode = me.getComponent('previewMode').getValue();

                                me.dealInitData(comp.store, idProperty);


                                me.initPreviewPage(evenType, previewMode.previewMode);

                                // 切换物料时 重置预览图数量 与 原图/自适应图片大小
                                parentComp.resetQtyAndSize();
                            })
                        }
                    },
                }
            },
            {
                xtype: 'radiogroup',
                fieldLabel: i18n.getKey('预览模式'),
                colspan: 2,
                hidden: !isDeliverInfo,
                margin: '10 0 0 20',
                labelWidth: 60,
                width: 250,
                vertical: true,
                itemId: 'previewMode',
                items: [
                    {
                        boxLabel: '简易预览',
                        width: 100,
                        name: 'previewMode',
                        inputValue: 'simplePreview'
                    },
                    {
                        boxLabel: '完整预览',
                        width: 100,
                        name: 'previewMode',
                        inputValue: 'completePreview',
                        checked: true
                    }
                ],
                listeners: {
                    afterrender: function (comp) {
                        if (isDeliverInfo) {
                            comp.setValue({previewMode: 'simplePreview'});
                        } else {
                            comp.setValue({previewMode: 'completePreview'});
                        }

                        // 跳过初始化的那次监听
                        comp.on('change', function (self, value) {
                            var previewMode = value['previewMode'];

                            me.initPreviewPage(evenType, previewMode)
                        })
                    }
                },
            },
            {
                xtype: 'combo',
                editable: false,
                haveReset: false,
                name: 'previewQty',
                itemId: 'previewQty',
                margin: !isDeliverInfo ? '10 20 0 20' : '10 20 0 0',
                width: 190,
                colspan: 2,
                value: 0,
                labelWidth: 90,
                store: {
                    fields: ['display', 'value'],
                    data: previewQtyData,
                },
                displayField: 'display',
                valueField: 'value',
                fieldLabel: '单行预览数量',
                // 重置数量
                resetQty: function () {
                    const me = this;
                    me.setValue(0);
                },
                // 是否禁用12张
                setDisabledPreviewQtyTwelve: function (width) {
                    var me = this,
                        store = me.store,
                        isDisabled = width <= 1450,
                        value = me.getValue(),
                        result = Ext.clone(previewQtyData),
                        el = me.el?.query('.iconTipInfo')[0],
                        tipInfo = `当窗口宽度小于1450px(像素)时,将禁用单行预览12张,<br>若触发禁用时处于12张预览将强制更换为自适应!<br>当前窗口宽度为: ${width}`;

                    if (!isDisabled) {
                        result.push({
                            display: 12,
                            value: 12,
                        });
                    } else {
                        if (value === 12) { //若触发禁用时处于12张预览将强制更换为"自适应"!
                            me.setValue(0);
                        }
                    }

                    store.proxy.data = result;
                    store.load();
                    el.setAttribute('data-qtip', tipInfo); // 动态设置tipInfo
                },
                tipInfo: `当窗口宽度小于1450px(像素)时,将禁用单行预览12张,<br>若触发禁用时处于12张预览将强制更换为自适应!`,
                listeners: {
                    afterrender: function (comp) {
                        // 初始化获取窗口宽度
                        comp.setDisabledPreviewQtyTwelve(parentComp.getWidth());

                        // 监听窗口宽度
                        controller.onWindowResize(function (width, height) {
                            //窗口可视宽度>=1450，方可以使用单行预览 12
                            comp.setDisabledPreviewQtyTwelve(width);
                        })
                    },
                    change: function (comp, newValue) {
                        // 最大值为12
                        if (+newValue) {
                            if (+newValue <= 12) {
                                var isEvenPositiveInteger = controller.isEvenPositiveInteger(+newValue);//验证双数

                                if (isEvenPositiveInteger) {
                                    parentComp.setImageQtyAndImageSize();
                                } else {
                                    JSShowNotification({
                                        type: 'info',
                                        title: '单行预览数仅支持输入双数,请重新输入!',
                                    })
                                }
                            } else {
                                JSShowNotification({
                                    type: 'info',
                                    title: '单行预览数最大值为12,请重新输入!',
                                })
                            }
                        } else {
                            parentComp.setImageQtyAndImageSize();
                        }
                    }
                }
            },
            {
                xtype: 'radiogroup',
                fieldLabel: i18n.getKey('优先级排序'),
                colspan: 5,
                margin: '10 0 0 20',
                labelWidth: 80,
                width: 250,
                vertical: true,
                itemId: 'pcMvPriority',
                items: [
                    {
                        boxLabel: 'MV排序',
                        width: 100,
                        name: 'previewMode',
                        inputValue: 'MV_PRIORITY',
                        checked: true
                    },
                    {
                        boxLabel: 'PC排序',
                        width: 100,
                        name: 'previewMode',
                        inputValue: 'PC_PRIORITY',
                    }
                ],
                listeners: {
                    afterrender: function (comp) {
                        // 跳过初始化的那次监听
                        comp.on('change', function (self, value) {
                            var previewMode = value['previewMode'];

                            me.parentComp.changePreviewModel(previewMode);
                        })
                    }
                },
            },
        ];

        me.callParent();
    },
    dealInitData: function (store, idProperty) {
        var me = this;
        var result = [];
        const storeData = store.data.items;
        storeData.forEach(item => {
            const {data} = item;
            idProperty === data['idProperty'] && (result = data['materialViews'])
        })

        result.forEach(item => {
            var {mappingIndex, pageContents} = item,
                pageContentsResult = [];

            if (mappingIndex) {
                mappingIndex.forEach(index => {
                    pageContentsResult.push(pageContents[index]);
                })
                item['pageContents'] = pageContentsResult;
            }
        })
        this.completeResult = result;
        this.simpleResult = Ext.clone(result);
        Ext.Array.each(this.simpleResult, function (item, index) {
            item.pageContentQty = 1;
            if (index == 0) {
                if (item.pageContents.length > 1) {
                    item.pageContents = [item.pageContents[0], item.pageContents[item.pageContents.length - 1]]
                } else {
                    item.pageContents = [item.pageContents[0]]
                }

            } else {
                if (item.pageContents.length > 1) {
                    item.pageContents = [item.pageContents[0], item.pageContents[item.pageContents.length - 1]]
                } else {
                    item.pageContents = [item.pageContents[0]]
                }
            }

        });
    },
    initPreviewPage: function (evenType, previewMode) {
        var me = this;
        if (previewMode === 'simplePreview') {
            me.parentComp.initPage(evenType, me.simpleResult);
        } else if (previewMode === 'completePreview') {
            me.parentComp.initPage(evenType, me.completeResult);
        }
    }
})
