Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.EditPreprocessWindow', {
    extend: 'Ext.window.Window',

    modal: true,
    layout: 'fit',
    maximized: true,
    maximizable: true,
    animCollapse: true,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('edit');
        /*me.listeners = {
            show : function(window) {
                window.getEl().setOpacity(0);
                window.getEl().fadeIn({duration: 2000});
            },
            beforeclose : function(window) {
                if(!window.shouldClose) {
                    window.getEl().fadeOut({duration: 2000, callback: function() {
                            window.shouldClose = true;
                            window.close();
                        }});
                }
                return window.shouldClose ? true : false;
            }
        };*/
        me.items = [Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.PcsPreprocessPanel', {
            graphData: me.graphData,
            formGraphData: me.formGraphData,
            win: me
        })];
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('save'),
            iconCls: 'icon_agree',
            handler: function () {
                var canvasData = me.itemPanel.getCanvasData();
                me.test = canvasData;
                var opratorValue = me.transform(canvasData);
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function () {
                me.close();
            }
        }]
        me.callParent(arguments);
        me.itemPanel = me.down('panel');
    }
    ,
    transform: function (data) {
        var me = this;
        var lines = [];
        var nodes = [];
        var tipMsgs = '';
        data.pens.forEach((item, idx, array) => {
            me.dataParseOnject(item.data);
            if (item.type === 0) {
                item.haveOut = false;
                item.haveIn = false;
                if (item.data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.CalculationOperationConfig') {
                    var expression = {
                        "resultType" : "Number",
                        "expressionEngine" : "JavaScript",
                        "inputs" : [],
                        "clazz" : "com.qpp.cgp.expression.Expression"
                    };
                    expression.resultType = item.data.functionValueType;
                    expression.expression = 'function expression(args) {' + item.data.expressionFunction +'}';
                    item.data.expression = expression;
                    /*delete item.data.functionValueType;
                    delete item.data.expressionFunction;*/
                    item.data.args = [];
                }
                nodes.push(item);
            } else if (item.type === 1) {
                lines.push(item);
            }
        });
        lines.forEach((line, idx, array) => {
            const inNode = nodes.find(function (node) {
                return node.id === line.to.id;
            });
            const outNode = nodes.find(function (node) {
                return node.id === line.from.id;
            });
            inNode.haveIn = true;
            outNode.haveOut = true;
            if (line.text === 'arg') {
                if (inNode.data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.CalculationOperationConfig') {
                    inNode.data.args.push(outNode.data);
                } else {
                    inNode.data.args = [];
                }
            } else {
                inNode.data[line.text] = outNode.data;
                delete inNode.data.args;
            }
        });
        let orignalNode = {};
        nodes.forEach((node, idx, array) => {
            tipMsgs += me.afterVerify(node.data, '', node.text);
            if ((node.haveIn === true && node.haveOut === false) || nodes.length == 1) {
                orignalNode = node.data;
            }
        });
        if (tipMsgs !== '') {
            alert(tipMsgs);
        } else {
            me.form.graphData = data;
            me.form.originOperator = orignalNode;
            me.close();
            return orignalNode;

        }
    },
    afterVerify: function (data, tipMsg, description) {
        if (data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.CalculationOperationConfig') {

            if (data.hasOwnProperty('value')) {
                tipMsg += '类型:' + data.clazz + '(' + description + ')' + '存在错误关联: value' + '\n';
                delete data.value;
            }

            if (data.hasOwnProperty('template')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: template' + '\n';
                delete data.template;
            }
            if (data.hasOwnProperty('repeat')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: repeat' + '\n';
                delete data.repeat;
            }

        } else if (data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PlaceholderOperationConfig') {
            if (data.hasOwnProperty('args')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: arg' + '\n';
                delete data.args;
            }
            if (data.hasOwnProperty('repeat')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: repeat' + '\n';
                delete data.repeat;
            }
            if(!data.hasOwnProperty('template')){
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '无关联operator: template' + '\n';
            }
            if(!data.hasOwnProperty('value')){
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '无关联operator: value' + '\n';
            }
        } else if (data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.CalculationArgOperationConfig') {
            if (data.hasOwnProperty('template')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: template' + '\n';
                delete data.template;
            }
            if (data.hasOwnProperty('repeat')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: repeat' + '\n';
                delete data.repeat;
            }
            if (data.hasOwnProperty('args')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: args' + '\n';
                delete data.args;
            }
            if(!data.hasOwnProperty('value')){
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '无关联operator: value' + '\n';
            }
        } else if (data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.SvgSourceOperationConfig' || data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.SimpleFlowGridValueOperationConfig' || data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.RtObjectSourceOperationConfig' || data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.CanvasesOperationConfig' || data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.FlowGridSourceOperationConfig') {
            if (data.hasOwnProperty('args')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: arg' + '\n';
                delete data.args;
            }
            if (data.hasOwnProperty('value')) {
                tipMsg += '类型:' + data.clazz + '(' + description + ')' + '存在错误关联: value' + '\n';
                delete data.value;
            }

            if (data.hasOwnProperty('template')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: template' + '\n';
                delete data.template;
            }
            if (data.hasOwnProperty('repeat')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: repeat' + '\n';
                delete data.repeat;
            }
        } else if (data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.JsonSelectorOperationConfig') {
            if (data.hasOwnProperty('args')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: arg' + '\n';
                delete data.args;
            }
            if (data.hasOwnProperty('value')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: value' + '\n';
                delete data.value;
            }
            if (data.hasOwnProperty('repeat')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: repeat' + '\n';
                delete data.repeat;
            }
            if(!data.hasOwnProperty('template')){
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '无关联operator: template' + '\n';
            }
        } else if (data.clazz === 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.RepeatOperationConfig') {
            if (data.hasOwnProperty('args')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: arg' + '\n';
                delete data.args;
            }
            if (data.hasOwnProperty('template')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: template' + '\n';
                delete data.template;
            }
            if (data.hasOwnProperty('value')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: value' + '\n';
                delete data.value;
            }
            if(!data.hasOwnProperty('repeat')){
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '无关联operator: repeat' + '\n';
            }
        }
        return tipMsg;
    },
    dataParseOnject: function (data){
        var objectKeys = ['expression','canvases','grid','gridItemTemplateOperationConfig','titleExpression','source','rtObjectId','itemQtySource','projection','parserParameters']
        Ext.Array.each(objectKeys,function (key){
            if (data[key] != undefined && typeof data[key] === 'string'){
                data[key] = JSON.parse(data[key]);
            }
        })

    }

});
