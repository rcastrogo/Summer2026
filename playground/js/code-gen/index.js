// @ts-nocheck

// Code generator for C# entities and repositories based on XML definitions
// This script parses a .pcg XML file and generates C# code for entities, repositories, and entity lists.
// example usage:


;(function(module) {

  // 1. Parsear el archivo .pcg nativamente
  function parseXML(xml) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "application/xml");
      const entityNodes = doc.querySelectorAll("Entity");

      return Array.from(entityNodes).map(node => {
        const properties = Array.from(node.querySelectorAll("Property")).map(p => ({
          name: p.getAttribute("name"),
          dbName: p.getAttribute("dbName"),
          dbType: p.getAttribute("dbType"),
          isId: p.getAttribute("name").toLowerCase() === "id",
          omitDal: p.getAttribute("OmitirDal") === "S",
          readOnly: p.getAttribute("ReadOnly") === "true"
        }));

        return {
          itemName: node.getAttribute("itemName"),
          collectionName: node.getAttribute("collectionName"),
          tableName: node.getAttribute("tableName"),
          namespace: node.getAttribute("namespace") || "",
          properties: properties
        };
      });
    }

  // 2. Utilidades para mapeo de tipos
  function mapCSharpType(dbType) {
    const types = {
      'string': 'string',
      'DateTime': 'string',
      'Date': 'string',
      'int': 'int',
      'double': 'double',
      'decimal': 'decimal',
      'short': 'short',
      'boolean': 'bool',
      'long': 'long'
    };
    return types[dbType] || dbType;
  }

  function getBuilderCondition(prop) {
    const type = prop.dbType.toLowerCase();
    if (type === 'string') return `.And("${prop.dbName}", "${prop.dbName}")`;
    if (type === 'date' || type === 'datetime') return `.AndDate("${prop.dbName}")`;
    if (type === 'int') return `.And("${prop.dbName}")`;
    return `// ${prop.dbName} .And ${prop.dbType}`;
  }

  function generateEntityItem(entity) {
    // Generar propiedades y campos privados (igual que antes)
    const properties = entity.properties.map(p => {
      const csharpType = mapCSharpType(p.dbType);
      const modifier = p.isId ? 'override ' : '';
      const privateVar = `_${p.name.charAt(0).toLowerCase() + p.name.slice(1)}`;

      let setter = `set { ${privateVar} = value; }`;
      if (p.dbType === 'Date' || p.dbType === 'DateTime') {
        setter = `set { \n        try { ${privateVar} = DateTime.Parse(value).ToString("dd/MM/yyyy"); }\n        catch { ${privateVar} = ""; }\n      }`;
      }
      if (p.readOnly) setter = '';

      return `
    private ${csharpType} ${privateVar};
    public ${modifier}${csharpType} ${p.name} {
      get { return ${privateVar}; }
      ${setter}
    }`;
    }).join('\n');

    // Listas de nombres de variables para pasar a los métodos del Repositorio
    const insertCallParams = entity.properties.filter(p => !p.isId && !p.omitDal).map(p => p.name).join(', ');
    const updateCallParams = entity.properties.filter(p => !p.omitDal).map(p => p.name).join(', ');

    return `
// ========================================================
// Negocio.${entity.itemName}.cs
// ========================================================
namespace Negocio.Entities${entity.namespace || ''} {
  using Dal.Core;
  using Dal.Repositories${entity.namespace || ''};
  using Negocio.Core;
  using System;

  [Serializable()]
  public class ${entity.itemName} : Entity {
    public ${entity.itemName}() { }
    public ${entity.itemName}(DbContext context) : base(context) { }

    public ${entity.itemName} Load() {
      return Load(Id);
    }
  
    public ${entity.itemName} Load(long id) {    
      using (${entity.collectionName}Repository repo = new ${entity.collectionName}Repository(DataContext)) {
        return repo.LoadOne<${entity.itemName}>(this, repo.GetItem(id));
      }   
    }

    public ${entity.itemName} Save() {
      using (${entity.collectionName}Repository repo = new ${entity.collectionName}Repository(DataContext)) {
        if (_id == 0) {
          _id = repo.Insert(${insertCallParams});
        } else {
          repo.Update(${updateCallParams});
        }
        return this;
      }
    }
            
    public void Delete() {
      using (${entity.collectionName}Repository repo = new ${entity.collectionName}Repository(DataContext)) {
        repo.Delete(_id);
      }
    }
${properties}
  }
}`;
  }

  function generateRepository(entity) {
    const propsForBuilder = entity.properties.filter(p => !p.isId && !p.omitDal);
    const propsForUpdate = entity.properties.filter(p => !p.omitDal);
    
    const builderLines = propsForBuilder.map(p => `              ${getBuilderCondition(p)}`).join('\n');

    // Parámetros para Insert (sin el ID)
    const insertParams = propsForBuilder.map(p => `${mapCSharpType(p.dbType)} ${p.name}`).join(', ');
    const insertBag = propsForBuilder.map(p => `                          .Use("${p.dbName}", ${p.name})`).join('\n');

    // Parámetros para Update (incluye el ID)
    const updateParams = propsForUpdate.map(p => `${mapCSharpType(p.dbType)} ${p.name}`).join(', ');
    const updateBag = propsForUpdate.map(p => `                          .Use("${p.dbName}", ${p.name})`).join('\n');

    return `
// ========================================================      
// ${entity.collectionName}Repository.cs
// ========================================================
namespace Dal.Repositories${entity.namespace || ''} {
  using Dal.Core;
  using Dal.Core.Loader;
  using Dal.Core.Queries;
  using System.Collections.Generic;
  using System.Data;

  [RepoName("Dal.Repositories${entity.namespace || ''}.${entity.collectionName}Repository")]
  public class ${entity.collectionName}Repository : RepositoryBase {
  
    public ${entity.collectionName}Repository(DbContext context) : base(context) { }
        
    public IDataReader GetItems(ParameterBag bag){
      var __builder = new SqlWhereClauseBuilder(bag)
${builderLines}
            .AndListOf<long>("Ids", "id"); 
      return GetItems(__builder);
    }
    
    public long Insert(${insertParams}) { 
      return Insert(new ParameterBag()
${insertBag});                
    }
  
    public int Update(${updateParams}) {
      return Update(new ParameterBag()
${updateBag});           
    }
  }
}`;
  }

  function generateEntityList(entity) {
    return `
// ========================================================
// Negocio.${entity.collectionName}.cs
// ========================================================    
namespace Negocio.Entities${entity.namespace || ''} {
  using Dal.Core;
  using Dal.Repositories${entity.namespace || ''};
  using Negocio.Core;
  using System.Collections.Generic;
  using Dal.Core.Queries;
  using System.Linq;

  [System.Xml.Serialization.XmlRoot("${entity.collectionName}")]
  public class ${entity.collectionName} : EntityList<${entity.itemName}> {
    public ${entity.collectionName}() { }
    public ${entity.collectionName}(DbContext context) : base(context) { }
        
    public ${entity.collectionName}(IEnumerable<${entity.itemName}> values) : base() {
      values.ToList().ForEach( u => Add(u));
    }

    public ${entity.collectionName} Load() {
      using (${entity.collectionName}Repository repo = new ${entity.collectionName}Repository(base.DataContext)) {
        return (${entity.collectionName})repo.Load<${entity.itemName}>(this, repo.GetItems());
      }
    }
  }
}`;
  }

  // --- Minimal API Endpoints generation ---
  function generateEndpoints(entity) {
    const ns = entity.namespace || '';
    const itemLower = entity.itemName.charAt(0).toLowerCase() + entity.itemName.slice(1);
    const routePath = `/api/${entity.collectionName.toLowerCase()}`;
    const nonIdProps = entity.properties.filter(p => !p.isId && p.name.toLowerCase() !== 'id');
    const createParams = nonIdProps.map(p => `${itemLower}.${p.name}`).join(', ');

    return `
// ========================================================
// Api.Endpoints.${entity.itemName}Endpoints.cs
// ========================================================
namespace Api.Endpoints${ns} {

  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Routing;
  using Negocio.Entities${ns};
  using Dal.Core;

  public static class ${entity.itemName}Endpoints {

    public static void Map${entity.itemName}Endpoints(this IEndpointRouteBuilder app) {
      var group = app.MapGroup("${routePath}").WithTags("${entity.collectionName}");

      // GET ALL
      group.MapGet("/", (DbContext dbContext) => {
        var lista = new ${entity.collectionName}(dbContext);
        return Results.Ok(lista.Load());
      });

      // GET BY ID
      group.MapGet("/{id:long}", (long id, DbContext dbContext) => {
        var item = new ${entity.itemName}(dbContext).Load(id);
        if (item == null) return Results.NotFound();
        return Results.Ok(item);
      });

      // POST (Create)
      group.MapPost("/", (${entity.itemName} ${itemLower}, DbContext dbContext) => {
        var item = new ${entity.itemName}(dbContext) {
${nonIdProps.map(p => `          ${p.name} = ${itemLower}.${p.name}`).join(',\n')}
        };
        item.Save();
        return Results.Created($"${routePath}/{item.Id}", item);
      });

      // PUT (Update)
      group.MapPut("/{id:long}", (long id, ${entity.itemName} ${itemLower}, DbContext dbContext) => {
        var item = new ${entity.itemName}(dbContext).Load(id);
        if (item == null) return Results.NotFound();
${nonIdProps.map(p => `        item.${p.name} = ${itemLower}.${p.name};`).join('\n')}
        item.Save();
        return Results.Ok(item);
      });

      // DELETE
      group.MapDelete("/{id:long}", (long id, DbContext dbContext) => {
        var item = new ${entity.itemName}(dbContext).Load(id);
        if (item == null) return Results.NotFound();
        item.Delete();
        return Results.NoContent();
      });
    }
  }
}`;
  }

  // --- Binders generation ---
  function mapBinderType(dbType) {
    const types = {
      'long': 'Integer',
      'int': 'Integer',
      'short': 'Integer',
      'double': 'Double',
      'decimal': 'Decimal',
      'boolean': 'Boolean',
      'DateTime': 'DateTime',
      'Date': 'DateTime'
    };
    return types[dbType] || '';
  }

  function generateBinders(entities) {
    return entities.map(entity => {
      const ns = entity.namespace ? `.${entity.namespace.replace(/^\./, '')}` : '';
      const header = `; ===========================================================\n; Negocio.Entities${ns}.${entity.itemName}\n; ===========================================================`;
      const className = `#Negocio.Entities${ns}.${entity.itemName}`;
      const lines = entity.properties.map((p, index) => {
        const varName = `_${p.name.charAt(0).toLowerCase()}${p.name.slice(1)}`;
        const binderType = mapBinderType(p.dbType);
        const paddedVar = varName.padEnd(30);
        return binderType
          ? ` ${index}, ${paddedVar}, ${binderType}`
          : ` ${index}, ${paddedVar}`;
      });
      return `${header}\n${className}\n${lines.join('\n')}`;
    }).join('\n\n');
  }

  // --- Queries generation ---
  function generateQueries(entities) {
    return entities.map(entity => {
      const ns = entity.namespace ? `.${entity.namespace.replace(/^\./, '')}` : '';
      const repoName = `Dal.Repositories${ns}.${entity.collectionName}Repository`;
      const header = `; ===========================================================\n; ${repoName}\n; ===========================================================`;

      const allDbNames = entity.properties.map(p => p.dbName);
      const nonIdProps = entity.properties.filter(p => !p.isId && p.name.toLowerCase() !== 'id');

      const selectCols = allDbNames.join(', ');
      const insertCols = nonIdProps.map(p => p.dbName).join(', ');
      const insertPlaceholders = nonIdProps.map((_, i) => `{${i}}`).join(', ');

      const updateSets = nonIdProps.map((p, i) => `${p.dbName} = {${i + 1}}`).join(', ');

      const lines = [
        `#${repoName}.OrderBy%Id ASC`,
        `#${repoName}.Delete%DELETE FROM ${entity.tableName} WHERE Id={0}`,
        `#${repoName}.Select%SELECT ${selectCols} FROM ${entity.tableName}`,
        `#${repoName}.Insert%INSERT INTO ${entity.tableName} (${insertCols}) VALUES(${insertPlaceholders}) ; SELECT CAST(SCOPE_IDENTITY() AS BIGINT);`,
        `#${repoName}.Update%UPDATE ${entity.tableName} SET ${updateSets} WHERE Id={0}`
      ];

      return `${header}\n${lines.join('\n')}`;
    }).join('\n\n\n');
  }

  function generateAllFromXml(xml) {
    const entities = parseXML(xml);
    return generateAllFiles(entities);
  }

  function generateAll(entities) {
    return generateAllFiles(entities);
  }

  function generateAllFiles(entities) {
    const files = [];

    // 4 files per entity: Repository, EntityList, EntityItem, Endpoints
    entities.forEach(entity => {
      files.push({
        fileName: `${entity.collectionName}Repository.cs`,
        content: generateRepository(entity).trim()
      });
      files.push({
        fileName: `${entity.collectionName}.cs`,
        content: generateEntityList(entity).trim()
      });
      files.push({
        fileName: `${entity.itemName}.cs`,
        content: generateEntityItem(entity).trim()
      });
      files.push({
        fileName: `${entity.itemName}Endpoints.cs`,
        content: generateEndpoints(entity).trim()
      });
    });

    // Binders file
    files.push({
      fileName: 'entities.binders.txt',
      content: generateBinders(entities)
    });

    // SQL Queries file
    files.push({
      fileName: 'entities.queries.txt',
      content: generateQueries(entities)
    });

    return files;
  }



  window.codeGen = {
    generate : generateAll,
    generateFromXml : generateAllFromXml
  }

}(window));