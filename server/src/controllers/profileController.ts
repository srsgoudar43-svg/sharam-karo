import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { profileSchema } from '../validation/schemas';
import { storeService } from '../services/storeService';

export const profileController = {
  // GET /api/profile
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const profile = await storeService.getProfile(user.id);
      res.status(200).json({ success: true, profile });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch profile' });
    }
  },

  // PUT /api/profile
  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validation = profileSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validation.error.format()
        });
        return;
      }

      const { fullName, farmName, location, farmSizeAcres, primarySoilType, role } = validation.data;

      const updated = await storeService.updateProfile(user.id, {
        full_name: fullName,
        farm_name: farmName,
        location,
        farm_size_acres: farmSizeAcres,
        primary_soil_type: primarySoilType,
        role: role || user.role,
      });

      res.status(200).json({ success: true, profile: updated });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: error.message || 'Failed to update profile' });
    }
  }
};
