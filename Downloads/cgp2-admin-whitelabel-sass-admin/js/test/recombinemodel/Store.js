Ext.define('CGP.test.recombinemodel.Store', {
    extend: 'Ext.data.Store',
    model: 'CGP.test.recombinemodel.Model',
    autoLoad: true,
    proxy: {
        type: 'memory'
    },
    autoSync : true,
    data: [
        {"clazz": "com.qpp.cgp.domain.bom.attribute.RtAttributeDef", "_id": "22001", "code": "9bf8b524-98b5-4ea1-8e2e-2bea76177369", "name": "mosaicData", "description": "宾客列表", "required": true, "valueType": "customType", "selectType": "non", "customType": {"clazz": "com.qpp.cgp.domain.bom.attribute.RtType", "_id": "50006", "idReference": "RtType", "attributesToRtTypes": []}, "arrayType": "Array"},
        {
            "_id" : "121825",
            "code" : "9bf8b524-98b5-4ea1-8e2e-2bea76177369",
            "name" : "mosaicData",
            "description" : "宾客列表",
            "required" : true,
            "valueType" : "customType",
            "selectType" : "non",
            "customType" : {
                "_id" : "50007",
                "attributesToRtTypes" : [],
                "idReference" : "RtType"
            },
            "arrayType" : "Array",
            "_class" : "com.qpp.cgp.domain.bom.attribute.RtAttributeDef"
        }
    ]
});