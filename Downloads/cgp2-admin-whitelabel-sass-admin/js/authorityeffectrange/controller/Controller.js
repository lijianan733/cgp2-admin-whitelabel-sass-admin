/**
 * Created by nan on 2018/8/13.
 */
Ext.define('CGP.authorityeffectrange.controller.Controller', {
    /**
     * 将json格式储存的表达式转换成通俗的表达式
     * @param value
     */
    toExpression: function (value) {
        var me = this;
        var node = value;
        var result = null;
        var tokenName = node.tokenName;
        var left = null;
        var down = null;
        var right = null;
        if (node.clazz == 'com.qpp.security.domain.ast.BinaryOperatorNode') {//二元子节点
            var leftResult = me.toExpression(node.left);
            var rightResult = me.toExpression(node.right);
            return '(' + leftResult + ' ' + ' ' + tokenName + ' ' + rightResult + ')';
        } else if (node.clazz == 'com.qpp.security.domain.ast.TernaryOperatorNode') {//三元子节点
            var leftResult = me.toExpression(node.left);
            var downResult = me.toExpression(node.down);
            var rightResult = me.toExpression(node.right);
            if (tokenName == 'between' || tokenName == 'BETWEEN') {
                return '(' + leftResult + ' ' + ' ' + tokenName + ' ' + downResult + ' AND ' + rightResult + '))'
            } else {
                return '(' + leftResult + ' ' + ' ' + tokenName + ' (' + downResult + ',' + rightResult + '))'
            }
        } else if (node.clazz == 'com.qpp.security.domain.ast.IdentNode') {//属性名叶子节点
            return node.property;

        } else if (node.clazz == 'com.qpp.security.domain.ast.ValueNode') {//属性值叶子节点
            var type = node.value.type;
            var value = node.value.value;
            if (type == 'boolean' || type == 'Boolean') {
                return Boolean.parseBoolean(value);
            } else if (type == 'number' || type == 'Number') {
                return Number.parseInt(value);
            } else if (type == 'Array' || type == 'array') {
                return value.split(',');
            } else {
                return "'" + value + "'";
            }
        }
    },
    saveFormValue: function (form, resetBtn, mask, recordId) {
        if (form.isValid()) {
            mask.show();
            var formValues = form.getValues();
            var method = form.formCreateOrEdit == 'create' ? 'POST' : 'PUT';
            var jsonData = {
                clazz: 'com.qpp.security.domain.acp.AccessControlPermission',
                idReference: 'AccessControlPermission',
                code: formValues.code,
                description: formValues.description,
                effectiveTime: form.getComponent('effectiveTime').getValue().getTime(),
                expireTime: form.getComponent('expireTime').getValue().getTime(),
                name: formValues.name,
                permissionType: formValues.permissionType,
                privilegeId: formValues.privilegeId.toString(),
                astMap: form.getComponent('scope').items.items[0].getValue()
            };
            var url = adminPath + 'api/security/acp/createACP';
            if (method == 'PUT') {
                url = adminPath + 'api/security/acp/' + recordId;
            }
            Ext.Ajax.request({
                url: url,
                method: method,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: jsonData,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        mask.hide();
                        resetBtn.setDisabled(false);
                        form.formCreateOrEdit = 'edit';
                        form.recordId = responseMessage.data._id;
                        var editPanel = top.Ext.getCmp("tabs").getComponent('authorityeffectrange_edit');
                        editPanel.setTitle(i18n.getKey('edit') + '_' + i18n.getKey('effectRange'));
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'));
                    } else {
                        mask.hide();
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    mask.hide();
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
        }
    },
    /**
     *
     * @param recordId
     * @param form
     * @param createOrEdit
     * @param mask
     */
    loadRecord: function (recordId, form, createOrEdit, mask) {
        if (createOrEdit == 'edit') {
            mask.show();
            var record = CGP.authorityeffectrange.model.AuthorityEffectRangeModel.load(recordId, {
                scope: this,
                failure: function (record, operation) {
                    mask.hide();
                },
                success: function (record, operation) {
                    var data = record.getData();
                    for (var i = 0; i < form.items.items.length; i++) {
                        var field = form.items.items[i];
                        var name = field.getName();
                        if (name == 'privilegeId') {
                            if (field.store.isLoading()) {
                                var gridField = field;
                                field.store.on('load', function () {
                                    gridField.setSubmitValue(data['privilegeDTO']._id);
                                }, this, {
                                    single: true
                                })
                            }
                            field.setSubmitValue(data['privilegeDTO']._id);

                        } else {
                            field.setValue(data[name]);
                        }
                    }
                    mask.hide();
                },
                callback: function (record, operation) {
                    mask.hide();
                }
            })
        }
    },
    /**
     * 修改jsontotress方法，使之不显示clazz,和value对象中的contains字段
     *  @type {jsonToTree} 原数据
     *  @rootName 根节点的标识
     */
    diyJsonToTree: function (data, rootName) {
        var root = {
            text: rootName || 'context',
            leaf: false,
            children: [],
            depth: 1,
            id: 'root'

        };
        var createChildNode = function (data, returnRoot) {
            for (var i in data) {//for in 遍历数组会把添加的方法原型链方法也遍历
                var itemId = JSGetUUID();
                if (Object.prototype.toString.call(data[i]) === '[object Array]') {//数组
                    var root = {
                        text: i,
                        leaf: false,
                        type: 'array',
                        children: [],
                        depth: returnRoot.depth + 1,
                        partnerId: returnRoot.id,
                        id: itemId,
                        icon: path + 'ClientLibs/extjs/resources/themes/images/ux/array.gif'
                    };
                    var newData = {};
                    for (var j = 0; j < data[i].length; j++) {
                        newData[j] = data[i][j];
                    }
                    data[i] = newData;
                    if (i == 'clazz' || i == 'constraints') {

                    } else {
                        returnRoot.children.push(root);
                        createChildNode(data[i], root);
                    }
                } else if (Object.prototype.toString.call(data[i]) === '[object Object]') {//对象
                    var root = {
                        text: i,
                        leaf: false,
                        type: 'object',
                        children: [],
                        depth: returnRoot.depth + 1,
                        partnerId: returnRoot.id,
                        id: itemId,
                        icon: path + 'ClientLibs/extjs/resources/themes/images/ux/object.gif'

                    };
                    returnRoot.children.push(root)
                    createChildNode(data[i], root);
                } else {
                    var leaf = {
                        text: i,
                        leaf: true,
                        type: 'map',
                        depth: returnRoot.depth + 1,
                        partnerId: returnRoot.id,
                        id: itemId,
                        value: data[i]

                    }
                    if (i == 'clazz' || i == 'constraints' || i == 'multilingualKey') {

                    } else {
                        returnRoot.children.push(leaf)
                    }
                }
            }
            return returnRoot;
        }
        return createChildNode(data, root);
    },
    /**
     *递归遍历，恢复被去除的clazz
     */
    recoverJson: function (json) {
        var me = this;
        var node = json;
        if (node.hasOwnProperty('down')) {//三元节点
            node.clazz = 'com.qpp.security.domain.ast.TernaryOperatorNode';
            me.recoverJson(node.down);
            me.recoverJson(node.left);
            me.recoverJson(node.right);
        } else if (node.hasOwnProperty('property')) {//属性节点
            node.clazz = 'com.qpp.security.domain.ast.IdentNode';
        } else if (node.hasOwnProperty('value') && Object.prototype.toString.call(node.value) === '[object Object]') {//value节点
            node.clazz = 'com.qpp.security.domain.ast.ValueNode';
            me.recoverJson(node.value);
        } else if (node.hasOwnProperty('type')) {//valueEx
            node.clazz = 'com.qpp.cgp.value.ConstantValue';
            node.constraints = [];
        } else {//二元节点
            node.clazz = 'com.qpp.security.domain.ast.BinaryOperatorNode';
            me.recoverJson(node.left);
            me.recoverJson(node.right);
        }
        return node;
    }
})