/**
 * @author xiu
 * @date 2023/10/16
 * 思路
 * 0.像这样的页面都应该放在errorstrickform中 监听其必填项
 * 默认监听所有field组件 如果需要监听非field组件
 * 需要加isFormField: true标识
 * 需补全方法
 * isValid 控制报错
 * validate 控制是否通过
 * getErrors 控制报错内容
 * getFieldLabel 控制报错内容名称
 *
 * 1.将页面分为两个部分 模板选择 / 容器
 *
 * 2.发送templateUrl请求拿到模板集合  放入模板选择组件中 默认选中第一个
 *
 * 3.根据用户选择的模板动态生成 容器内的内容
 *   选中时拿到模板的name 发送templateInfoUrl请求拿到该模板的信息并渲染生成
 *   (其中 请求参数与layer参数配置为动态传染 padding为静态赋值)
 *
 * 4.layer参数配置 需求:控制添加 默认填写默认值 添加上限由数中的数组长度
 *   渲染时将 将数据绑定按钮上限与生成内容 并生成内容
 *   监听其容器的 add && remove 如果容器长度达到上限将禁用添加按钮
 *
 * 5.监听文件格式的选项 SVG时显示图片预览按钮
 *
 * 6.点击生成跳转SVG/PDF页面
 */
Ext.Loader.syncRequire([
    'CGP.tools.createPathFile.view.createLayerParam',
])
Ext.define('CGP.tools.createPathFile.view.createFile', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.createFile',
    title: i18n.getKey('生成File'),
    layout: 'fit',
    autoScroll: true,
    initComponent: function () {
        const me = this,
            controller = Ext.create('CGP.tools.createPathFile.controller.Controller'),
            templateUrl = controller.getUrl('templateUrl'),
            // 请求模板 拿到模板name
            template = controller.getQuery(templateUrl);
        me.tbar = [
            {
                xtype: 'button',
                width: 80,
                iconCls: 'icon_create_file',
                itemId: 'createFileBtn',
                text: i18n.getKey('生成'),
                handler: function (btn) {
                    const panel = btn.ownerCt.ownerCt,
                        form = panel.getComponent('form'),
                        container = form.getComponent('container');

                    if (form.isValid()) {
                        const {
                                name,
                                parameters,
                                sizeUnit,
                                dpi,
                                format,
                                layerSettings,
                                padding
                            } = container.diyGetValue(),
                            params = {
                                templateName: name
                            },
                            postData = {
                                exportSetting: Ext.Object.merge({
                                    dpi: dpi,
                                    format: format,
                                    layerSettings: layerSettings
                                }, padding),
                                name: name,
                                variables: parameters,
                                sizeUnit: sizeUnit
                            },
                            createFileUrl = controller.getUrl('createFileUrl', params);

                        JSSetLoading(true);

                        controller.asyncEditQuery(createFileUrl, postData, false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    const data = responseText.data,
                                        {file} = data;
                                    window.open(file);
                                }
                            }
                        })
                    }
                }
            },
            {
                xtype: 'button',
                width: 80,
                iconCls: 'icon_check',
                itemId: 'checkBtn',
                hidden: true,
                text: i18n.getKey('预览'),
                handler: function (btn) {
                    const panel = btn.ownerCt.ownerCt,
                        tools = btn.ownerCt,
                        form = panel.getComponent('form'),
                        container = form.getComponent('container');

                    if (form.isValid()) {
                        const {
                                name,
                                parameters,
                                sizeUnit,
                                dpi,
                                format,
                                layerSettings,
                                padding
                            } = container.diyGetValue(),
                            params = {
                                templateName: name
                            },
                            postData = {
                                exportSetting: Ext.Object.merge({
                                    dpi: dpi,
                                    format: format,
                                    layerSettings: layerSettings
                                }, padding),
                                name: name,
                                variables: parameters,
                                sizeUnit: sizeUnit
                            },
                            createFileUrl = controller.getUrl('createFileUrl', params);

                        JSSetLoading(true);

                        controller.asyncEditQuery(createFileUrl, postData, false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    const data = responseText.data,
                                        {file} = data,
                                        imageComp = btn.ownerCt.getComponent('imgAutoSize'),
                                        produceImage = form.getComponent('produceImageId');


                                    imageComp && tools.remove(imageComp);
                                    produceImage && form.remove(produceImage);

                                    tools.add(
                                        {
                                            xtype: 'imagecomponent',
                                            id: 'imgAutoSize',
                                            imgCls: 'imgAutoSize',
                                            itemId: 'imgAutoSize',
                                            src: file,
                                            autoEl: 'div',
                                            style: 'cursor: pointer',
                                            width: 80,
                                            height: 80,
                                            hidden: true,
                                        },
                                    )

                                    form.add(
                                        {
                                            xtype: 'panel',
                                            id: 'produceImageId',
                                            itemId: 'produceImageId',
                                            width: 800,
                                            height: 600,
                                            autoScroll: true,
                                            margin: '5 25 5 25',
                                            bodyStyle: 'border-color:silver;background-color:#ededed;',
                                            header: {
                                                style: 'background-color:white;',
                                                color: 'black',
                                                border: '0 0 0 0'
                                            },
                                            layout: {
                                                type: 'vbox',
                                                align: 'center'
                                            },
                                            items: []
                                        }
                                    )

                                    // 再同一时间通过pictures的点击将图层渲染入已创建的容器中
                                    var options = {
                                            title: true,
                                            button: false,
                                            navbar: false,
                                            fullscreen: false,
                                            diyUrl: file,
                                            container: 'produceImageId' //渲染到哪里
                                        },
                                        pictures = document.getElementById('imgAutoSize');

                                    /**
                                     * pictures 触发器
                                     * options 配置
                                     */
                                    me.viewer = new window.Viewer(pictures, options);


                                    var newImageComp = tools.getComponent('imgAutoSize'),
                                        image = newImageComp.el.dom.getElementsByTagName('img')[0],
                                        event = new MouseEvent('click', {
                                            button: 1,
                                            view: window,
                                            bubbles: true,
                                            cancelable: true
                                        });

                                    newImageComp.setSrc(file);
                                    image.dispatchEvent(event);
                                }
                            }
                        })
                    }
                }
            },
        ]
        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                layout: 'vbox',
                autoScroll: true,
                items: [
                    {
                        xtype: 'combo',
                        name: 'template',
                        itemId: 'template',
                        editable: false,
                        allowBlank: false,
                        margin: '5 25 5 25',
                        width: 350,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['_id', 'name'],
                            data: template
                        }),
                        valueField: 'name',
                        displayField: 'name',
                        fieldLabel: i18n.getKey('模板选择'),
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                const panel = combo.ownerCt,
                                    container = panel.getComponent('container'),

                                    // 监听更换模板时 更换请求模板详细信息数据
                                    templateInfoUrl = controller.getUrl('templateInfoUrl', {
                                        templateName: newValue
                                    }),
                                    templateInfo = controller.getQuery(templateInfoUrl);

                                // 渲染数据
                                container.clearInfo();
                                container.diySetValue(templateInfo);
                            }
                        }
                    },
                    {
                        xtype: 'container',
                        name: 'container',
                        itemId: 'container',
                        layout: 'vbox',
                        width: '100%',
                        defaults: {
                            margin: '5 25 5 25',
                            width: 350
                        },
                        diySetValue: function (data) {
                            const me = this,
                                items = me.items.items;
                            items.forEach(item => {
                                const {name} = item;
                                if (['dpi', 'padding', 'layerSettings'].includes(name)) {
                                    item.diySetValue ? (item.diySetValue(data['exportSetting'])) : (item.setValue(data['exportSetting']));
                                } else {
                                    item.diySetValue ? (item.diySetValue(data[name])) : (item.setValue(data[name]));
                                }
                            })
                        },
                        diyGetValue: function () {
                            var me = this,
                                items = me.items.items,
                                result = {};
                            items.forEach(item => result[item.name] = item.diyGetValue ? item.diyGetValue() : item.getValue());
                            return result;
                        },
                        clearInfo: function () {
                            const me = this,
                                items = me.items.items
                            items.forEach(item => {
                                item.clearInfo && item.clearInfo()
                            })
                        },
                        items: [
                            {
                                xtype: 'combo',
                                name: 'format',
                                itemId: 'format',
                                editable: false,
                                allowBlank: false,
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['key', 'value'],
                                    data: [
                                        {
                                            key: 'SVG',
                                            value: 'SVG'
                                        },
                                        {
                                            key: 'PDF',
                                            value: 'PDF'
                                        }
                                    ]
                                }),
                                valueField: 'value',
                                displayField: 'key',
                                fieldLabel: i18n.getKey('文件格式'),
                                /*listeners: {
                                    change: function (comp, newValue) {
                                        const panel = comp.ownerCt.ownerCt.ownerCt,
                                            toolbar = panel.down("toolbar[@dock='top']"),
                                            checkBtn = toolbar.getComponent('checkBtn');
                                        checkBtn.setVisible(newValue === 'SVG');
                                    }
                                }*/
                            },
                            {
                                xtype: 'numberfield',
                                name: 'dpi',
                                itemId: 'dpi',
                                fieldLabel: i18n.getKey('dpi'),
                                diySetValue: function (data) {
                                    const me = this;
                                    me.setValue(data?.dpi);
                                },
                            },
                            {
                                xtype: 'textfield',
                                name: 'sizeUnit',
                                itemId: 'sizeUnit',
                                hidden: true,
                                fieldLabel: i18n.getKey('sizeUnit'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'name',
                                itemId: 'name',
                                hidden: true,
                                fieldLabel: i18n.getKey('name'),
                            },
                            {
                                xtype: 'fieldset',
                                name: 'parameters',
                                itemId: 'parameters',
                                width: 600,
                                title: '<font color="green">' + i18n.getKey('请求参数') + '</font>',
                                layout: {
                                    type: 'table',
                                    columns: 2
                                },
                                defaults: {
                                    xtype: 'numberfield',
                                    padding: '10 10 10 25',
                                    labelWidth: 60,
                                    allowBlank: false,
                                },
                                items: [],
                                clearInfo: function () {
                                    const me = this;
                                    me.removeAll();
                                },
                                diySetValue: function (data) {
                                    const me = this;
                                    !Ext.isEmpty(data) && data.forEach(item => {
                                        var {defaultValue, name, alias, type} = item,
                                            emptyText = '',
                                            emptyTextGather = {
                                                L: '成品線高度(mm)',
                                                W: '成品線寬度(mm)',
                                            };

                                        ['L', 'W'].includes(name) && (emptyText = emptyTextGather[name]);
                                        me.add(
                                            {
                                                xtype: 'numberfield',
                                                fieldLabel: name,
                                                name: name,
                                                itemId: name,
                                                alias: alias,
                                                type: type,
                                                emptyText: emptyText,
                                                value: defaultValue
                                            },
                                        )
                                    })
                                },
                                diyGetValue: function () {
                                    var me = this,
                                        items = me.items.items,
                                        result = {};
                                    items.forEach(item => result[item.name] = item.diyGetValue ? item.diyGetValue() : item.getValue());
                                    return result;
                                },
                            },
                            {
                                xtype: 'fieldset',
                                width: 600,
                                name: 'padding',
                                itemId: 'padding',
                                title: '<font color="green">' + i18n.getKey('padding') + '</font>',
                                layout: {
                                    type: 'table',
                                    columns: 2
                                },
                                defaults: {
                                    padding: '10 10 10 25',
                                    labelWidth: 60,
                                    minValue: 0,
                                    allowBlank: false,
                                },
                                diySetValue: function (data) {
                                    const me = this,
                                        items = me.items.items;
                                    items.forEach(item => {
                                        item.setValue(data[item.name]);
                                    })
                                },
                                diyGetValue: function () {
                                    var me = this,
                                        items = me.items.items,
                                        result = {};
                                    items.forEach(item => result[item.name] = item.diyGetValue ? item.diyGetValue() : item.getValue());
                                    return result;
                                },
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        name: 'paddingTop',
                                        itemId: 'paddingTop',
                                        fieldLabel: i18n.getKey('Top'),
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'paddingRight',
                                        itemId: 'paddingRight',
                                        fieldLabel: i18n.getKey('Right'),
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'paddingBottom',
                                        itemId: 'paddingBottom',
                                        fieldLabel: i18n.getKey('Bottom'),
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'paddingLeft',
                                        itemId: 'paddingLeft',
                                        fieldLabel: i18n.getKey('Left'),
                                    },
                                ]
                            },
                            {
                                xtype: 'createLayerParam',
                                name: 'layerSettings',
                                itemsId: 'layerSettings',
                                width: '100%',
                                title: i18n.getKey('layer参数配置'),
                            },
                        ]
                    },
                ]
            }
        ];
        me.listeners = {
            afterrender: function (panel) {
                const form = panel.getComponent('form')
                const combo = form.getComponent('template')
                // 默认赋值第一个选项
                !Ext.isEmpty(template) && combo.setValue(template[0]?.name);
            },
        }
        me.callParent();
    }
})