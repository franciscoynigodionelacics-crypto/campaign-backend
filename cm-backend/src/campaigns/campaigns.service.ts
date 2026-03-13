import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignsService implements OnModuleInit {
  private supabase: SupabaseClient;

  onModuleInit() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ ERROR: SUPABASE_URL or SUPABASE_ANON_KEY is missing from .env');
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Connected to Supabase successfully');
  }

  async create(dto: CreateCampaignDto) {
    // We map the DTO fields to match your 'hc_campaigns' table columns exactly
    const { data, error } = await this.supabase
      .from('campaigns') 
      .insert([
        {
          title: dto.title,
          target_amount: dto.target_amount,
          description: dto.description,
          collected_amount: 0, // Default start value
          cover_image_key: dto.cover_image_key || 'default_cover.jpg',
          status: dto.status || 'Pending',
          // Note: created_at is usually handled by Supabase automatically
        },
      ])
      .select();

    if (error) {
      console.error('Supabase Insert Error:', error.message);
      throw new InternalServerErrorException(`Could not save to Supabase: ${error.message}`);
    }

    return data[0];
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Fetch Error:', error.message);
      throw new InternalServerErrorException(`Could not fetch from Supabase: ${error.message}`);
    }

    return data;
  }
}