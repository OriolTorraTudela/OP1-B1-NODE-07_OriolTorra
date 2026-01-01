const Task = require('../models/Tasks');
const fs = require('fs');
const path = require('path');

const DEFAULT_IMAGE_URL = process.env.DEFAULT_TASK_IMAGE_URL || 'http://localhost:3000/images/default-task.png';

// Crear una nova tasca (assignant imatge per defecte si no ve informada)
exports.createTask = function (req, res) {
  const data = Object.assign({}, req.body);

  if (!data.image || data.image === '') {
    data.image = DEFAULT_IMAGE_URL;
  }

  // Afegir l'usuari autenticat automàticament
  data.user = req.user._id;

  const task = new Task(data);

  task.save()
    .then(function (savedTask) {
      res.status(201).json(savedTask);
    })
    .catch(function (error) {
      res.status(400).json({
        message: "Error, no s'ha pogut crear la tasca",
        details: error.message
      });
    });
};

// Obtenir totes les tasques de l'usuari autenticat
exports.getAllTasks = function (req, res) {
  Task.find({ user: req.user._id })
    .then(function (tasks) {
      res.status(200).json(tasks);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Error al obtenir totes les tasques",
        details: error.message
      });
    });
};

// Obtenir una tasca per ID (només si pertany a l'usuari)
exports.getTaskById = function (req, res) {
  Task.findOne({ _id: req.params.id, user: req.user._id })
    .then(function (task) {
      if (!task) {
        return res.status(404).json({ message: "Tasca no trobada" });
      }
      res.status(200).json(task);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Error al obtenir la tasca",
        details: error.message
      });
    });
};

// Actualitzar una tasca existent (només si pertany a l'usuari)
exports.updateTask = function (req, res) {
  Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  )
    .then(function (updatedTask) {
      if (!updatedTask) {
        return res.status(404).json({ message: "Tasca no trobada" });
      }
      res.status(200).json(updatedTask);
    })
    .catch(function (error) {
      res.status(400).json({
        message: "Error, tasca no actualitzada",
        details: error.message
      });
    });
};

// Eliminar una tasca (i la seva imatge local si escau) - només si pertany a l'usuari
exports.deleteTask = function (req, res) {
  let imageUrl = null;

  Task.findOne({ _id: req.params.id, user: req.user._id })
    .then(function (task) {
      if (!task) {
        return res.status(404).json({ message: "Tasca no trobada" });
      }

      imageUrl = task.image;

      return Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    })
    .then(function (deletedTask) {
      if (!deletedTask) {
        // Ja s'ha gestionat abans, però per seguretat
        return;
      }

      // Esborrar imatge local associada (si és una imatge d'/uploads)
      if (imageUrl && imageUrl.indexOf('/uploads/') !== -1) {
        const parts = imageUrl.split('/uploads/');
        if (parts.length === 2) {
          const filename = parts[1];
          const filePath = path.join(__dirname, '..', 'uploads', filename);

          fs.unlink(filePath, function (err) {
            if (err) {
              console.error("Error esborrant la imatge local:", err.message);
            }
          });
        }
      }

      res.status(200).json({
        message: "Tasca eliminada",
        task: deletedTask
      });
    })
    .catch(function (error) {
      if (!res.headersSent) {
        res.status(500).json({
          message: "Error, no es pot eliminar la tasca",
          details: error.message
        });
      }
    });
};

// Actualitzar la imatge d'una tasca (només si pertany a l'usuari)
exports.updateTaskImage = function (req, res) {
  const newImageUrl = req.body.image;

  if (!newImageUrl) {
    return res.status(400).json({
      message: "Cal proporcionar la nova URL de la imatge"
    });
  }

  Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { image: newImageUrl },
    { new: true, runValidators: true }
  )
    .then(function (updatedTask) {
      if (!updatedTask) {
        return res.status(404).json({ message: "Tasca no trobada" });
      }

      res.status(200).json({
        message: "Imatge de la tasca actualitzada",
        task: updatedTask
      });
    })
    .catch(function (error) {
      res.status(400).json({
        message: "Error actualitzant la imatge de la tasca",
        details: error.message
      });
    });
};

// Restablir imatge per defecte (només si pertany a l'usuari)
exports.resetTaskImageToDefault = function (req, res) {
  Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { image: DEFAULT_IMAGE_URL },
    { new: true, runValidators: true }
  )
    .then(function (updatedTask) {
      if (!updatedTask) {
        return res.status(404).json({ message: "Tasca no trobada" });
      }

      res.status(200).json({
        message: "Imatge restablerta a la imatge per defecte",
        task: updatedTask
      });
    })
    .catch(function (error) {
      res.status(400).json({
        message: "Error restablint la imatge de la tasca",
        details: error.message
      });
    });
};

// Estadístiques de tasques (només les de l'usuari autenticat)
exports.getTaskStats = function (req, res) {
  Task.find({ user: req.user._id })
    .then(function (tasks) {
      const totalTasks = tasks.length;

      let completedTasks = 0;
      let pendingTasks = 0;

      let totalCost = 0;
      let completedTasksCost = 0;
      let pendingTasksCost = 0;

      let totalHoursEstimated = 0;
      let totalHoursReal = 0;

      let tasksWithDescription = 0;
      let tasksWithoutDescription = 0;

      let defaultImages = 0;
      let customImages = 0;
      let cloudinaryImages = 0;
      let localImages = 0;

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const dayOfWeek = startOfToday.getDay(); // 0 = diumenge
      const diffToMonday = (dayOfWeek + 6) % 7;
      const startOfWeek = new Date(
        startOfToday.getFullYear(),
        startOfToday.getMonth(),
        startOfToday.getDate() - diffToMonday
      );

      let tasksThisMonth = 0;
      let tasksThisWeek = 0;
      let tasksToday = 0;

      let completedThisMonth = 0;
      let completedThisWeek = 0;
      let completedToday = 0;

      tasks.forEach(function (task) {
        // Completed / pending
        if (task.completed) {
          completedTasks += 1;
          completedTasksCost += task.cost || 0;
        } else {
          pendingTasks += 1;
          pendingTasksCost += task.cost || 0;
        }

        // Costos
        totalCost += task.cost || 0;

        // Hores
        totalHoursEstimated += task.hours_estimated || 0;
        totalHoursReal += task.hours_real || 0;

        // DescripciÃ³
        if (task.description && task.description.trim() !== '') {
          tasksWithDescription += 1;
        } else {
          tasksWithoutDescription += 1;
        }

        // Imatges
        if (task.image) {
          if (task.image === DEFAULT_IMAGE_URL) {
            defaultImages += 1;
          } else {
            customImages += 1;

            if (task.image.indexOf('res.cloudinary.com') !== -1) {
              cloudinaryImages += 1;
            }

            if (task.image.indexOf('/uploads/') !== -1) {
              localImages += 1;
            }
          }
        }

        // Dates de creaciÃ³
        if (task.createdAt) {
          const createdAt = new Date(task.createdAt);

          if (createdAt >= startOfMonth && createdAt < startOfTomorrow) {
            tasksThisMonth += 1;
          }

          if (createdAt >= startOfWeek && createdAt < startOfTomorrow) {
            tasksThisWeek += 1;
          }

          if (createdAt >= startOfToday && createdAt < startOfTomorrow) {
            tasksToday += 1;
          }
        }

        // Dates de finalitzaciÃ³
        if (task.finished_at && task.completed) {
          const finished = new Date(task.finished_at);

          if (finished >= startOfMonth && finished < startOfTomorrow) {
            completedThisMonth += 1;
          }

          if (finished >= startOfWeek && finished < startOfTomorrow) {
            completedThisWeek += 1;
          }

          if (finished >= startOfToday && finished < startOfTomorrow) {
            completedToday += 1;
          }
        }
      });

      const completionRate = totalTasks > 0
        ? parseFloat(((completedTasks / totalTasks) * 100).toFixed(2))
        : 0;

      const averageCostPerTask = totalTasks > 0
        ? parseFloat((totalCost / totalTasks).toFixed(2))
        : 0;

      const averageCostCompleted = completedTasks > 0
        ? parseFloat((completedTasksCost / completedTasks).toFixed(2))
        : 0;

      const averageCostPending = pendingTasks > 0
        ? parseFloat((pendingTasksCost / pendingTasks).toFixed(2))
        : 0;

      const averageHoursEstimated = totalTasks > 0
        ? parseFloat((totalHoursEstimated / totalTasks).toFixed(2))
        : 0;

      const averageHoursReal = totalTasks > 0
        ? parseFloat((totalHoursReal / totalTasks).toFixed(2))
        : 0;

      const hoursDifference = totalHoursReal - totalHoursEstimated;
      const hoursOverrun = hoursDifference > 0 ? hoursDifference : 0;
      const hoursSaved = hoursDifference < 0 ? -hoursDifference : 0;

      const timeEfficiency = totalHoursEstimated > 0
        ? parseFloat(((totalHoursReal / totalHoursEstimated) * 100).toFixed(2))
        : 0;

      const response = {
        success: true,
        data: {
          // EstadÃ­stiques generals
          overview: {
            totalTasks: totalTasks,
            completedTasks: completedTasks,
            pendingTasks: pendingTasks,
            completionRate: completionRate
          },

          // EstadÃ­stiques econÃ²miques
          financial: {
            totalCost: totalCost,
            completedTasksCost: completedTasksCost,
            pendingTasksCost: pendingTasksCost,
            averageCostPerTask: averageCostPerTask,
            averageCostCompleted: averageCostCompleted,
            averageCostPending: averageCostPending
          },

          // EstadÃ­stiques temporals
          time: {
            totalHoursEstimated: totalHoursEstimated,
            totalHoursReal: totalHoursReal,
            timeEfficiency: timeEfficiency,
            averageHoursEstimated: averageHoursEstimated,
            averageHoursReal: averageHoursReal,
            hoursDifference: hoursDifference,
            hoursOverrun: hoursOverrun,
            hoursSaved: hoursSaved
          },

          // TendÃ¨ncies recents
          recent: {
            tasksThisMonth: tasksThisMonth,
            completedThisMonth: completedThisMonth,
            tasksThisWeek: tasksThisWeek,
            tasksToday: tasksToday,
            completedThisWeek: completedThisWeek,
            completedToday: completedToday
          },

          // Altres estadÃ­stiques
          misc: {
            tasksWithDescription: tasksWithDescription,
            tasksWithoutDescription: tasksWithoutDescription,
            customImages: customImages,
            defaultImages: defaultImages,
            imageStats: {
              defaultImages: defaultImages,
              customImages: customImages,
              cloudinaryImages: cloudinaryImages,
              localImages: localImages
            }
          }
        }
      };

      res.status(200).json(response);
    })
    .catch(function (error) {
      res.status(500).json({
        success: false,
        message: "Error al calcular les estadÃ­stiques de les tasques",
        details: error.message
      });
    });
};