/**
 * Created by nan on 2020/5/22.
 * 显示错误信息，
 * 分为两大种，一个是属性映射错误，
 * 一个是BomItem映射错误
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.ErrorInfoFrom', {
    extend: 'Ext.form.Panel',
    ErrorObject: null,
    data: null,
    header: false,
    defaults: {
        padding: '5 25 5 25',
        width: 350,
        readOnly: true
    },
    initComponent: function () {
        var me = this;
        var attributeMappingConfigError = [
            'com.qpp.cgp.domain.record.mapping2test.failure.AttributeMappingError',
            'com.qpp.cgp.domain.record.mapping2test.failure.AttributeLackConfigError',
        ];
        var bomItemMappingConfigError = [
            'com.qpp.cgp.domain.record.mapping2test.failure.BomItemLackConfigError',
            'com.qpp.cgp.domain.record.mapping2test.failure.BomItemMappingError',
        ];
        var MappingErrorType = {
            CalculateError: '表达式计算错误',
            ReturnValueTypeError: 'ValueEx返回值类型错误',
            LackConfigError: '缺失配置错误',
            RtTypeCheckRtObjectError: '返回属性值类型错误',
            ContextInputError: 'valueEx上下文错误',
            ResultNotSmuError: '生成物料非SMU错误'
        };
        var BomItemMappingErrorType = {
            BomItemQtyError: 'Bom比例配置',
            BomItemCloneQtyError: 'UBI BomItem分裂数量配置',
            MaterialFilterError: '物料过滤配置',
            MappingMatchError: '查找对应的Mapping配置',
            BomItemIndexError: 'BomItem位置定义配置',
            UbiToObiConfigError: 'UBI生成OBI配置'
        };
        if (Ext.Array.contains(attributeMappingConfigError, me.data.clazz)) {
            me.title = '属性映射配置错误';
        } else if (Ext.Array.contains(bomItemMappingConfigError, me.data.clazz)) {
            me.title = 'BomItem映射配置错误';
            if (me.data.clazz == 'com.qpp.cgp.domain.record.mapping2test.failure.BomItemMappingError') {
                me.data.errorBomItem = me.data.bomItemName + '<' + me.data.bomItemId + '>' + '(' + me.data.bomItemType + ')'
            }
        } else {
            me.title = '其他类型错误';
        }
        var formItems = [
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('material') + i18n.getKey('path'),
                name: 'materialPath',
                value: me.data.materialPath,
                itemId: 'materialPath'
            },
            /*  {
                  xtype: 'textfield',
                  fieldLabel: i18n.getKey('错误类型'),
                  value: MappingErrorType[me.data.errorDetail.errorType],
                  name: 'mappingErrorType',
                  itemId: 'mappingErrorType'
              },*/
            /*    {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('物料映射配置') + i18n.getKey('id'),
                    name: 'mappingId',
                    value: me.data.mappingId,
                    itemId: 'mappingId'
                },*/
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('出错的属性映射配置'),
                name: 'attributePath',
                hidden: Ext.isEmpty(me.data.attributePath),
                value: '<a href="#" title="查看配置" )>' + me.data.attributePath + '</a>',
                itemId: 'attributePath',
                listeners: {
                    render: function (display) {
                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                        ela.on("click", function () {
                            var bomItemId = me.data.bomItemId;
                            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                            var managerMaterialMappingV3 = builderConfigTab.getComponent('managermaterialmappingV3');
                            builderConfigTab.setActiveTab(managerMaterialMappingV3);
                            var frames = window.parent.frames;
                            for (var i = 0; i < frames.length; i++) {
                                //处理ubi的情况
                                var leftBomTree = frames[i].Ext.getCmp('leftBomTree');
                                if (leftBomTree) {
                                    leftBomTree.getSelectionModel().deselectAll();
                                    var path = me.data.materialPath;
                                    var nodes = path.split(',');
                                    for (var j = 1; j < nodes.length; j++) {
                                        nodes[j] = nodes[j - 1] + '-' + nodes[j];
                                    }
                                    path = '/' + nodes.join('/');
                                    var attributes = me.data.attributePath.split(',');
                                    for (var j = 1; j < attributes.length; j++) {
                                        attributes[j] = attributes[j - 1] + ',' + attributes[j];
                                    }
                                    var attributePath = '/root/' + attributes.join('/');
                                    leftBomTree.attributePath = attributePath;
                                    leftBomTree.selectedMappingId = me.data.mappingId;
                                    leftBomTree.selectPath(path);
                                }
                            }
                        });
                    }
                }
            },
            {
                xtype: 'fieldcontainer',
                itemId: 'lackAttributePaths',
                name: 'lackAttributePaths',
                hidden: Ext.isEmpty(me.data.lackAttributePaths),
                fieldLabel: i18n.getKey('缺失配置的属性'),
                layout: {
                    type: 'table',
                    columns: 2
                },
                items: function () {
                    var items = [];
                    if (me.data.lackAttributePaths) {
                        for (var i = 0; i < me.data.lackAttributePaths.length; i++) {
                            var a = {
                                xtype: 'displayfield',
                                padding: '0 10 0 10',
                                attribute: me.data.lackAttributePaths[i],
                                value: '<a href="#" title="去添加缺失的配置" )>' + me.data.lackAttributePaths[i] + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var attribute = display.attribute;
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                                            var managerMaterialMappingV3 = builderConfigTab.getComponent('managermaterialmappingV3');
                                            builderConfigTab.setActiveTab(managerMaterialMappingV3);
                                            var frames = window.parent.frames;
                                            for (var i = 0; i < frames.length; i++) {
                                                //处理ubi的情况
                                                var leftBomTree = frames[i].Ext.getCmp('leftBomTree');
                                                if (leftBomTree) {
                                                    leftBomTree.getSelectionModel().deselectAll();
                                                    var path = me.data.materialPath;
                                                    var nodes = path.split(',');
                                                    for (var j = 1; j < nodes.length; j++) {
                                                        nodes[j] = nodes[j - 1] + '-' + nodes[j];
                                                    }
                                                    path = '/' + nodes.join('/');
                                                    var attributes = attribute.split(',');
                                                    for (var j = 1; j < attributes.length; j++) {
                                                        attributes[j] = attributes[j - 1] + ',' + attributes[j];
                                                    }
                                                    var attributePath = '/root/' + attributes.join('/');
                                                    leftBomTree.attributePath = attributePath;
                                                    leftBomTree.selectedMappingId = me.data.mappingId;
                                                    leftBomTree.selectPath(path);
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                            items.push(a);
                        }
                        return items;
                    }
                }()

            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('缺失的配置BomItem'),
                name: 'lackConfigBomItem',
                hidden: Ext.isEmpty(me.data.lackConfigBomItemId),
                value: '<a href="#" title="去添加缺失的配置" )>' + me.data.lackConfigBomItemId + '</a>',
                itemId: 'lackConfigBomItem',
                listeners: {
                    render: function (display) {
                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                        ela.on("click", function () {
                            var bomItemId = me.data.lackConfigBomItemId;
                            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                            var managerMaterialMappingV3 = builderConfigTab.getComponent('managermaterialmappingV3');
                            builderConfigTab.setActiveTab(managerMaterialMappingV3);
                            var frames = window.parent.frames;
                            for (var i = 0; i < frames.length; i++) {
                                //处理ubi的情况
                                var leftBomTree = frames[i].Ext.getCmp('leftBomTree');
                                if (leftBomTree) {
                                    leftBomTree.getSelectionModel().deselectAll();
                                    var path = me.data.materialPath + ',' + bomItemId;
                                    var nodes = path.split(',');
                                    for (var j = 1; j < nodes.length; j++) {
                                        nodes[j] = nodes[j - 1] + '-' + nodes[j];
                                    }
                                    leftBomTree.selectedMappingId = me.data.mappingId;
                                    path = '/' + nodes.join('/');
                                    leftBomTree.selectPath(path);
                                }
                            }
                        });
                    }
                }
            },
            /*     {
                     xtype: 'textfield',
                     fieldLabel: i18n.getKey('出错的配置类型'),
                     name: 'BomItemMappingErrorType',
                     value: BomItemMappingErrorType[me.data.errorType],
                     itemId: 'BomItemMappingErrorType'
                 },*/
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('出错的BomItem映射配置'),
                name: 'errorBomItem',
                hidden: Ext.isEmpty(me.data.errorBomItem),
                value: '<a href="#" title="查看配置" )>' + me.data.errorBomItem + '</a>',
                itemId: 'errorBomItem',
                listeners: {
                    render: function (display) {
                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                        ela.on("click", function () {
                            var bomItemId = me.data.bomItemId;
                            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                            var managerMaterialMappingV3 = builderConfigTab.getComponent('managermaterialmappingV3');
                            builderConfigTab.setActiveTab(managerMaterialMappingV3);
                            var frames = window.parent.frames;
                            for (var i = 0; i < frames.length; i++) {
                                //处理ubi的情况
                                var leftBomTree = frames[i].Ext.getCmp('leftBomTree');
                                if (leftBomTree) {
                                    leftBomTree.getSelectionModel().deselectAll();
                                    var path = me.data.materialPath + ',' + bomItemId;
                                    var nodes = path.split(',');
                                    for (var j = 1; j < nodes.length; j++) {
                                        nodes[j] = nodes[j - 1] + '-' + nodes[j];
                                    }
                                    leftBomTree.selectedMappingId = me.data.mappingId;
                                    path = '/' + nodes.join('/');
                                    leftBomTree.selectPath(path);
                                }
                            }
                        });
                    }
                }
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('出错的BOM配置类型'),
                name: 'errorType',
                value: BomItemMappingErrorType[me.data.errorType],
                itemId: 'errorType'
            },
            {
                xtype: 'textarea',
                fieldLabel: i18n.getKey('错误详情'),
                name: 'errorMessage',
                height: 250,
                width: 600,
                value: me.data.errorDetail?.errorMessage,
                itemId: 'errorMessage'
            }
        ];
        for (var i = 0; i < formItems.length; i++) {
            if (formItems[i].itemId == 'errorBomItem' ||
                formItems[i].itemId == 'attributePath' ||
                formItems[i].itemId == 'lackConfigBomItem' ||
                formItems[i].itemId == 'lackAttributePaths'
            ) {

            } else {
                formItems[i].hidden = Ext.isEmpty(formItems[i].value);
                formItems[i].disabled = Ext.isEmpty(formItems[i].value);
            }
        }
        me.items = formItems;
        me.callParent();

    }
})
