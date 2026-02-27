/**
 * @Description:
 * @author nan
 * @date 2021/12/28
 * 注意：
 * 两种新建方式，物料分类页添加，和物料管理页添加
 * 无父物料时，
 *
 * 有父物料时，
 * 父物料的rtType配置，和spuRtType是否有继承
 *
 * smu
 * 只能添加固定件,
 * spu属性不能修改RtTpe，能修改值
 *
 *
 */
Ext.Loader.syncRequire([
    'CGP.material.view.information.BomItem',
    'CGP.material.view.information.BaseInfoByCreate'
])
Ext.define("CGP.material.view.CreateMaterialWin", {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    maximizable: true,
    autoScroll: true,
    width: 1050,
    height: 600,
    title: i18n.getKey('create') + i18n.getKey('material'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    defaults: {
        width: '100%',
    },
    config: {
        clazz: null,
        category: null,//物料分类
        gridStore: null,//物料管理Grid的store
        materialType: null,//物料类型，值MaterialSpu,MaterialType
        parentData: null,//父物料数据
        parentNode: null,//导航树的节点，不同的入口该配置不一定有
        rtTypeNode: null,//父物料的描述属性的rtType
        spuRtTypeNode: null,//父物料的spu属性的rtType
        treeView: null,//导航树
    },
    isValid: function () {
        var me = this;
        var baseInfo = me.getComponent('baseInfo');
        var bomItem = me.getComponent('bomItem');
        if (baseInfo.isValid() & bomItem.isValid()) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 获取指定id的rtObject信息
     */
    getBomRtObjectInfo: function (rtObjectId) {
        var me = this;
        var url = adminPath + 'api/bom/RtObject/' + rtObjectId + '?includeReferenceEntity=false';
        var result = null;
        JSAjaxRequest(url, 'GET', false, null, '', function (require, success, response) {
            var responseMessage = Ext.JSON.decode(response.responseText);
            result = responseMessage.data;
        });
        return result;


    },
    /**
     * 新建rtObject
     */
    createNewRtObject: function (data) {
        var me = this;
        var url = adminPath + 'api/bom';
        var result = false;
        var jsonData = [
            {
                "entities": [data],
                "entityName": "RtObject"
            }
        ];
        JSAjaxRequest(url, 'POST', false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                result = true;
            }
        })
        return result;
    },
    /**
     * 创建物料前，先把对应rtObject创建了
     * @param rtTypeId
     * @param type 类型为rtType还是spuRtType
     * @returns {string}
     */
    buildRtObject: function (rtTypeId, type) {
        var me = this;
        var newKey = JSGetCommonKey();
        var successful = false;
        var rtObjectData = '';
        if (newKey) {
            var rtObjectId = newKey;
            rtObjectData = {
                "_id": rtObjectId.toString(),
                "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                "idReference": "RtObject",
                "rtType": {
                    "_id": rtTypeId,
                    "idReference": "RtType",
                    "clazz": "com.qpp.cgp.domain.bom.attribute.RtType"
                }
            };
            if (type == 'rtType') {
                //父物料有配置rtObject
                if (me.parentData && me.parentData.rtObject) {
                    //获取rtObjec信息，把父的rtObject信息加入到当期的rtObject中
                    var objectJSON = me.getBomRtObjectInfo(me.parentData.rtObject['_id'])?.objectJSON;
                    rtObjectData.objectJSON = objectJSON;
                } else {
                    rtObjectData.objectJSON = {};
                }
            } else if (type == 'spuRtType') {
                if (me.parentData && me.parentData.spuRtTypeRtObject) {
                    //获取rtObjec信息，把父的rtObject信息加入到当期的rtObject中
                    var objectJSON = me.getBomRtObjectInfo(me.parentData.spuRtTypeRtObject['_id'])?.objectJSON;
                    rtObjectData.objectJSON = objectJSON;
                } else {
                    rtObjectData.objectJSON = {};
                }
            }
            var rtObjectString = JSON.stringify(rtObjectData);
            successful = me.createNewRtObject(rtObjectString);
        }
        if (successful) {
            return rtObjectData;
        }
    },
    getValue: function () {
        var me = this;
        var baseInfo = me.getComponent('baseInfo');
        var bomItem = me.getComponent('bomItem');
        var data = baseInfo.getValues();
        data.childItems = bomItem.getValue();
        data.category = me.category ? me.category.getId() : data.category;
        //有父物料
        if (me.parentData) {
            data.parentMaterialType = {
                _id: me.parentData._id,
                clazz: 'com.qpp.cgp.domain.bom.MaterialType',
                idReference: 'Material'
            };
        }
        if (data.rtType) {
            data.rtType = {
                _id: data.rtType,
                idReference: 'RtType',
                clazz: 'com.qpp.cgp.domain.bom.attribute.RtType'
            };
        }
        if (data.spuRtType) {
            data.spuRtType = {
                _id: data.spuRtType,
                idReference: 'RtType',
                clazz: 'com.qpp.cgp.domain.bom.attribute.RtType'
            };
        }
       ;
        return data;
    },
    /**
     * 校验bomItem是否符合要求
     * @param data
     */
    confirmAddMaterial: function (data) {
        var me = this;
        var isValid = true;
        if (data.type == 'MaterialSpu') {
            var typeArray = [];
            var unBomItem = [];
            Ext.Array.each(data.childItems, function (item) {
                if (item.itemMaterial.clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
                    typeArray.push(item.name);
                }
                if (item.type != 'FixedBOMItem') {
                    unBomItem.push(item.name);
                }
            });
            if (Ext.isEmpty(unBomItem)) {
                if (Ext.isEmpty(typeArray)) {
                    if (!me.gridStore) {
                        me.gridStore = null;
                    }
                    /*
                                        controller.addMaterial(data, win, me.parentNode, me.selectTypeWin, me.gridStore)
                    */
                } else {
                    //不再约束固定件只能选SMU
                 /*   isValid = false;
                    Ext.Msg.alert('提示', 'bomItem名称为：' + typeArray.join(',') + '的关联物料的Type为SMT,请重新选择关联物料！')*/
                }
            } else {
                isValid = false;
                Ext.Msg.alert('提示', '名称为：' + unBomItem.join(',') + '的bomItem需要配置为固定件！')
            }
        } else {
            if (!me.gridStore) {
                me.gridStore = null;
            }
            /*
                        controller.addMaterial(data, win, me.parentNode, me.selectTypeWin, me.gridStore)
            */
        }
        return isValid;
    },

    /**
     * 新建物料
     */
    createMaterial: function (data) {
        var me = this;
        var controller = Ext.create('CGP.material.controller.Controller');
        if (!Ext.isEmpty(data.rtType)) {
            //有
            var rtObjectData = me.buildRtObject(data.rtType._id, 'rtType');
            if (rtObjectData) {
                data.rtObject = rtObjectData;
            }
        } else {
            //无，说明父，和子都没rtType
            delete data.rtType;
        }

        //spuRtType是SMT上才有
        if (!Ext.isEmpty(data.spuRtType)) {
            //smt
            var spuRtObjectData = me.buildRtObject(data.spuRtType._id, 'spuRtType');
            if (spuRtObjectData) {
                data.spuRtTypeRtObject = spuRtObjectData;
            }
        } else {
            //说明是smu，或者没有spuRtType配置SMT
            //如果有父物料,且父物料上的spuRtTypeRtObject有配置,直接使用父物料的，但是换个id
            delete data.spuRtType;
            if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                if (me.parentData && me.parentData.spuRtTypeRtObject) {//有父物料，且父物料有spuRtObject
                    data.spuRtTypeRtObject = {};
                    var newRtObjectId = JSGetCommonKey();
                    var rtObject = me.getBomRtObjectInfo(me.parentData.spuRtTypeRtObject._id);
                    rtObject._id = newRtObjectId.toString();
                    var rtObjectString = JSON.stringify(rtObject);
                    me.createNewRtObject(rtObjectString);
                    data.spuRtTypeRtObject = rtObject;
                }
            }
        }
        console.log(data);
        var isValid = me.confirmAddMaterial(data);
        if (isValid) {
            controller.addMaterial(data, me, me.parentNode, me.selectTypeWin, me.gridStore);

        }
    },
    initComponent: function () {
        var me = this;
        if (me.materialType == 'MaterialSpu') {
            me.clazz = 'com.qpp.cgp.domain.bom.MaterialSpu';
        } else {
            me.clazz = 'com.qpp.cgp.domain.bom.MaterialType';
        }
        me.items = [
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                margin: 0,
                items: [
                    {
                        xtype: 'displayfield',
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('baseInfo') + '</font>',
                    }
                ],
                isValid: function () {
                    return true;
                },
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
            },
            {
                xtype: 'baseinfobycreate',
                padding: 0,
                border: false,
                header: false,
                defaults: {
                    width: 450,
                    labelAlign: 'left',
                    margin: '10 25 5 25'
                },
                itemId: 'baseInfo',
                clazz: me.clazz,
                category: me.category,//物料分类
                materialType: me.materialType,//物料类型，值MaterialSpu,MaterialType
                parentData: me.parentData,//父物料数据
                parentNode: me.parentNode,
                rtTypeNode: me.rtTypeNode,//父物料的描述属性的rtType
                spuRtTypeNode: me.spuRtTypeNode,//父物料的spu属性的rtType
            },
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                margin: '25 0 0 0',
                items: [
                    {
                        xtype: 'displayfield',
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('bomItem') + '</font>',
                    },
                    {
                        xtype: 'displayfield',
                        value: '<font  >' + '提示：(1)SMU的bomItem只允许存在固定件.' + '</font>',
                    }
                ],
                isValid: function () {
                    return true;
                },
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
            },
            {
                xtype: 'bomItemPanel',
                flex: 1,
                padding: 0,
                border: false,
                header: false,
                minHeight: 150,
                maxHeight: 350,
                isCreate: true,
                data: {
                    clazz: me.clazz,
                    materialType: me.materialType
                },
                itemId: 'bomItem',
                bodyStyle: {
                    borderColor: 'silver'
                },
                listeners: {
                    afterrender: function () {
                        var bomItemPanel = this;
                        var win = bomItemPanel.ownerCt;
                        var childItems = [];
                        if (win.parentData) {
                            win.parentData.childItems.forEach(function (item) {
                                item.isExtend = true;
                                childItems.push(item);
                            })
                        }
                        bomItemPanel.refreshData({
                            materialType: win.materialType,
                            type: win.materialType,//不知道当时为啥会有两个属性来描述相同的东西
                            clazz: win.clazz,
                            leaf: true,
                            isLeaf: true,
                            childItems: childItems
                        })
                    }
                }
            }
        ];
        me.bbar = {
            xtype: 'bottomtoolbar',
            lastStepBtnCfg: {
                hidden: false
            },
            saveBtnCfg: {
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    if (win.isValid()) {
                        var data = win.getValue();
                        win.createMaterial(data);
                    }
                }
            }
        }
        me.callParent();
    }
})