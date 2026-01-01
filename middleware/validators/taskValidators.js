// Middleware de validació per a tasques

// Validar creació de tasca
exports.validateCreateTask = function (req, res, next) {
  const errors = [];

  // Validar title (obligatori)
  if (!req.body.title || req.body.title.trim() === '') {
    errors.push({
      field: 'title',
      message: 'El títol és obligatori'
    });
  } else if (req.body.title.length > 200) {
    errors.push({
      field: 'title',
      message: 'El títol no pot superar els 200 caràcters'
    });
  }

  // Validar cost (obligatori i positiu)
  if (req.body.cost === undefined || req.body.cost === null || req.body.cost === '') {
    errors.push({
      field: 'cost',
      message: 'El cost és obligatori'
    });
  } else {
    const cost = parseFloat(req.body.cost);
    if (isNaN(cost)) {
      errors.push({
        field: 'cost',
        message: 'El cost ha de ser un número vàlid'
      });
    } else if (cost < 0) {
      errors.push({
        field: 'cost',
        message: 'El cost no pot ser negatiu'
      });
    }
  }

  // Validar hours_estimated (obligatori i positiu)
  if (req.body.hours_estimated === undefined || req.body.hours_estimated === null || req.body.hours_estimated === '') {
    errors.push({
      field: 'hours_estimated',
      message: 'Les hores estimades són obligatòries'
    });
  } else {
    const hoursEstimated = parseFloat(req.body.hours_estimated);
    if (isNaN(hoursEstimated)) {
      errors.push({
        field: 'hours_estimated',
        message: 'Les hores estimades han de ser un número vàlid'
      });
    } else if (hoursEstimated < 0) {
      errors.push({
        field: 'hours_estimated',
        message: 'Les hores estimades no poden ser negatives'
      });
    }
  }

  // Validar description (opcional però amb límit)
  if (req.body.description && req.body.description.length > 1000) {
    errors.push({
      field: 'description',
      message: 'La descripció no pot superar els 1000 caràcters'
    });
  }

  // Validar hours_real (opcional però si existeix ha de ser positiu)
  if (req.body.hours_real !== undefined && req.body.hours_real !== null && req.body.hours_real !== '') {
    const hoursReal = parseFloat(req.body.hours_real);
    if (isNaN(hoursReal)) {
      errors.push({
        field: 'hours_real',
        message: 'Les hores reals han de ser un número vàlid'
      });
    } else if (hoursReal < 0) {
      errors.push({
        field: 'hours_real',
        message: 'Les hores reals no poden ser negatives'
      });
    }
  }

  // Validar image (opcional però si existeix ha de ser una URL vàlida)
  if (req.body.image && req.body.image.trim() !== '') {
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    if (!urlPattern.test(req.body.image)) {
      errors.push({
        field: 'image',
        message: 'La imatge ha de ser una URL vàlida'
      });
    }
  }

  // Validar completed (opcional però si existeix ha de ser boolean)
  if (req.body.completed !== undefined && typeof req.body.completed !== 'boolean') {
    // Intentar convertir strings a boolean
    if (req.body.completed === 'true' || req.body.completed === '1') {
      req.body.completed = true;
    } else if (req.body.completed === 'false' || req.body.completed === '0') {
      req.body.completed = false;
    } else {
      errors.push({
        field: 'completed',
        message: 'El camp completed ha de ser un valor booleà'
      });
    }
  }

  // Validar finished_at (opcional però si existeix ha de ser una data vàlida)
  if (req.body.finished_at && req.body.finished_at !== '') {
    const finishedAt = new Date(req.body.finished_at);
    if (isNaN(finishedAt.getTime())) {
      errors.push({
        field: 'finished_at',
        message: 'La data de finalització no és vàlida'
      });
    }
  }

  // Si hi ha errors, retornar-los
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errors de validació',
      errors: errors
    });
  }

  // Si tot és correcte, continuar
  next();
};

// Validar actualització de tasca
exports.validateUpdateTask = function (req, res, next) {
  const errors = [];

  // Validar title (opcional en actualització però si existeix ha de ser vàlid)
  if (req.body.title !== undefined) {
    if (req.body.title.trim() === '') {
      errors.push({
        field: 'title',
        message: 'El títol no pot estar buit'
      });
    } else if (req.body.title.length > 200) {
      errors.push({
        field: 'title',
        message: 'El títol no pot superar els 200 caràcters'
      });
    }
  }

  // Validar cost (si existeix ha de ser vàlid)
  if (req.body.cost !== undefined && req.body.cost !== null && req.body.cost !== '') {
    const cost = parseFloat(req.body.cost);
    if (isNaN(cost)) {
      errors.push({
        field: 'cost',
        message: 'El cost ha de ser un número vàlid'
      });
    } else if (cost < 0) {
      errors.push({
        field: 'cost',
        message: 'El cost no pot ser negatiu'
      });
    }
  }

  // Validar hours_estimated (si existeix ha de ser vàlid)
  if (req.body.hours_estimated !== undefined && req.body.hours_estimated !== null && req.body.hours_estimated !== '') {
    const hoursEstimated = parseFloat(req.body.hours_estimated);
    if (isNaN(hoursEstimated)) {
      errors.push({
        field: 'hours_estimated',
        message: 'Les hores estimades han de ser un número vàlid'
      });
    } else if (hoursEstimated < 0) {
      errors.push({
        field: 'hours_estimated',
        message: 'Les hores estimades no poden ser negatives'
      });
    }
  }

  // Validar description (opcional però amb límit)
  if (req.body.description !== undefined && req.body.description.length > 1000) {
    errors.push({
      field: 'description',
      message: 'La descripció no pot superar els 1000 caràcters'
    });
  }

  // Validar hours_real (opcional però si existeix ha de ser positiu)
  if (req.body.hours_real !== undefined && req.body.hours_real !== null && req.body.hours_real !== '') {
    const hoursReal = parseFloat(req.body.hours_real);
    if (isNaN(hoursReal)) {
      errors.push({
        field: 'hours_real',
        message: 'Les hores reals han de ser un número vàlid'
      });
    } else if (hoursReal < 0) {
      errors.push({
        field: 'hours_real',
        message: 'Les hores reals no poden ser negatives'
      });
    }
  }

  // Validar image (opcional però si existeix ha de ser una URL vàlida)
  if (req.body.image !== undefined && req.body.image !== null && req.body.image.trim() !== '') {
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    if (!urlPattern.test(req.body.image)) {
      errors.push({
        field: 'image',
        message: 'La imatge ha de ser una URL vàlida'
      });
    }
  }

  // Validar completed (opcional però si existeix ha de ser boolean)
  if (req.body.completed !== undefined && typeof req.body.completed !== 'boolean') {
    // Intentar convertir strings a boolean
    if (req.body.completed === 'true' || req.body.completed === '1') {
      req.body.completed = true;
    } else if (req.body.completed === 'false' || req.body.completed === '0') {
      req.body.completed = false;
    } else {
      errors.push({
        field: 'completed',
        message: 'El camp completed ha de ser un valor booleà'
      });
    }
  }

  // Validar finished_at (opcional però si existeix ha de ser una data vàlida)
  if (req.body.finished_at !== undefined && req.body.finished_at !== null && req.body.finished_at !== '') {
    const finishedAt = new Date(req.body.finished_at);
    if (isNaN(finishedAt.getTime())) {
      errors.push({
        field: 'finished_at',
        message: 'La data de finalització no és vàlida'
      });
    }
  }

  // Si hi ha errors, retornar-los
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errors de validació',
      errors: errors
    });
  }

  // Si tot és correcte, continuar
  next();
};

// Validar que un ID de MongoDB és vàlid
exports.validateMongoId = function (req, res, next) {
  const id = req.params.id;
  
  // Pattern per validar ObjectId de MongoDB (24 caràcters hexadecimals)
  const mongoIdPattern = /^[a-f\d]{24}$/i;
  
  if (!mongoIdPattern.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID de tasca invàlid',
      details: 'L\'ID proporcionat no té el format correcte'
    });
  }
  
  next();
};

// Validar actualització d'imatge
exports.validateUpdateImage = function (req, res, next) {
  const errors = [];

  // Validar que existeix la URL de la imatge
  if (!req.body.image || req.body.image.trim() === '') {
    errors.push({
      field: 'image',
      message: 'La URL de la imatge és obligatòria'
    });
  } else {
    // Validar que sigui una URL vàlida
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    if (!urlPattern.test(req.body.image)) {
      errors.push({
        field: 'image',
        message: 'La imatge ha de ser una URL vàlida'
      });
    }
  }

  // Si hi ha errors, retornar-los
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errors de validació',
      errors: errors
    });
  }

  next();
};