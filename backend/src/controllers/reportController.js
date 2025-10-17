import Report from '../models/Report.js';
import User from '../models/User.js';

export const createReport = async (req, res) => {
  try {
    const { title, description, severity } = req.body;
    if (!title || !description || !severity) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const attachments = (req.files || []).map((file) => `/uploads/${file.filename}`);
    const report = await Report.create({
      title,
      description,
      severity,
      reporter: req.user._id,
      attachments
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { reporter: req.user._id };
    const reports = await Report.find(query).populate('reporter', 'name email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    if (req.user.role !== 'admin' && report.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (req.user.role !== 'admin') {
      delete data.status;
      delete data.reward;
      delete data.reporter;
    }
    Object.assign(report, data);
    await report.save();
    if (req.user.role === 'admin' && typeof data.reward === 'number') {
      await User.findByIdAndUpdate(report.reporter, { $inc: { points: data.reward } });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    if (req.user.role !== 'admin' && report.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await report.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
